import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Check, Smartphone, CreditCard, Globe2, ArrowLeft, Wallet } from 'lucide-react';
import Notice from '../../components/ui/Notice';
import PaymentWaiting from '../../components/payments/PaymentWaiting';
import useApi from '../../hooks/useApi';
import { api, formatRwf } from '../../api/client';
import { isRwandaMobileMoney, usePaymentConfig } from '../../api/payments';
import '../../components/dashboard/DashboardPage.scss';
import '../../components/auth/AuthForm.scss';
import './FanVoteCheckoutPage.scss';

// Only Mobile Money is live: Paypack handles MTN MoMo and Airtel Money. Cards need another provider later.
const METHODS = [
  { key: 'momo', label: 'Mobile Money', icon: Smartphone, available: true },
  { key: 'card', label: 'Cards (soon)', icon: CreditCard, available: false },
  { key: 'intl', label: 'International (soon)', icon: Globe2, available: false },
];

// Buy a vote package. With a contestant: the votes go straight to them once paid.
// Without one: they go to the fan's vote balance, to use later on the Vote page.
export default function FanVoteCheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const payConfig = usePaymentConfig();
  const packages = useApi('/votes/packages');

  // The contestant comes from the Contestants page (router state) or a link (?contestant=<id>).
  const [contestant, setContestant] = useState(location.state?.contestant ?? null);
  useEffect(() => {
    const id = params.get('contestant');
    if (!contestant && id) {
      api(`/contestants/${id}`, { auth: false })
        .then((d) => setContestant(d.contestant))
        .catch(() => {});
    }
  }, [params, contestant]);

  const [selected, setSelected] = useState(null); // package
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [sending, setSending] = useState(false);
  const [started, setStarted] = useState(null); // { purchase, payment, instructions }
  const [result, setResult] = useState(null); // 'SUCCESSFUL' | 'FAILED'

  const pay = async (e) => {
    e.preventDefault();
    const next = {};
    if (!selected) next.package = 'Choose how many votes to buy.';
    if (!isRwandaMobileMoney(phone)) next.phone = 'Enter an MTN or Airtel Rwanda number (07X XXX XXXX).';
    setErrors(next);
    setFormError('');
    if (Object.keys(next).length) return;

    setSending(true);
    try {
      // Step 1: create the purchase. The backend asks Paypack to send the prompt to this phone.
      const data = await api('/votes/purchases', {
        method: 'POST',
        body: { packageId: selected.id, contestantId: contestant?.id, paymentMethod: 'momo', phone },
      });
      setStarted(data); // Step 2: show "approve on your phone" and wait (PaymentWaiting)
    } catch (err) {
      setErrors(err.fieldErrors ?? {});
      setFormError(err.message);
    } finally {
      setSending(false);
    }
  };

  const cancel = async () => {
    try {
      await api(`/votes/purchases/${started.purchase.id}/cancel`, { method: 'POST' });
    } catch {
      /* already paid or failed: nothing to cancel */
    }
    setStarted(null);
  };

  const header = (
    <div className="dash-page__header">
      <div>
        <button type="button" className="vote-checkout__back" onClick={() => navigate(-1)}>
          <ArrowLeft size={15} /> Back
        </button>
        <h1 className="dash-page__title">{contestant ? `Buy votes for ${contestant.name}` : 'Buy votes'}</h1>
        <p className="dash-page__subtitle">
          {contestant
            ? `${contestant.category?.name ?? ''} — the votes go to ${contestant.name} as soon as the payment is confirmed.`
            : 'The votes are added to your vote balance. Use them on any contestant from the Vote page.'}
        </p>
      </div>
    </div>
  );

  // Step 3: the result.
  if (result === 'SUCCESSFUL') {
    return (
      <div className="dash-page">
        <div className="vote-checkout__success">
          <div className="vote-checkout__success-icon">
            <Check size={28} />
          </div>
          <h2>Payment successful!</h2>
          <p>
            {selected.votes} vote{selected.votes > 1 ? 's' : ''} ({formatRwf(selected.priceRwf)}){' '}
            {selected.votes > 1 ? 'were' : 'was'}{' '}
            {contestant ? (
              <>
                added for <strong>{contestant.name}</strong>.
              </>
            ) : (
              'added to your vote balance.'
            )}
          </p>
          <div className="vote-checkout__success-actions">
            <Link to="/dashboard/fan/purchased-votes" className="btn btn--outline">
              View Purchased Votes
            </Link>
            <Link to={contestant ? '/dashboard/fan/contestants' : '/vote'} className="btn btn--gold">
              {contestant ? 'Back to Contestants' : 'Use my votes'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (started) {
    return (
      <div className="dash-page">
        {header}
        <PaymentWaiting
          payment={started.payment}
          instructions={started.instructions}
          mode={payConfig?.mode}
          onFinished={(status) => setResult(status)}
          onCancel={result ? undefined : cancel}
        />
        {result === 'FAILED' && (
          <button type="button" className="btn btn--gold" style={{ marginTop: 16 }} onClick={() => { setStarted(null); setResult(null); }}>
            Try again
          </button>
        )}
      </div>
    );
  }

  const off = payConfig && !payConfig.enabled;

  return (
    <div className="dash-page">
      {header}

      {off && <Notice tone="info">Buying votes is not available yet. You can still use your free vote on the Vote page.</Notice>}
      {payConfig?.mode === 'test' && <Notice tone="info">Test mode: payments are simulated and no real money is taken.</Notice>}
      <Notice tone="error">{formError || packages.error?.message}</Notice>

      <div className="vote-checkout">
        <div className="vote-checkout__packages">
          <h2 className="dash-page__section-title">Vote packages</h2>
          <div className="vote-checkout__table">
            <div className="vote-checkout__table-head">
              <span>Votes</span>
              <span>Price</span>
            </div>
            {(packages.data?.packages ?? []).map((pkg) => (
              <button
                type="button"
                key={pkg.id}
                className={`vote-checkout__table-row ${selected?.id === pkg.id ? 'is-selected' : ''}`}
                onClick={() => setSelected(pkg)}
              >
                <span>{pkg.votes.toLocaleString()}</span>
                <span>{formatRwf(pkg.priceRwf)}</span>
              </button>
            ))}
          </div>
          {errors.package && <span className="auth-form__error">{errors.package}</span>}
          {!contestant && (
            <p style={{ color: '#a8a49b', fontSize: '0.8rem', marginTop: 10 }}>
              <Wallet size={13} style={{ verticalAlign: -2 }} /> Want to give them straight to someone? Open a contestant and click “Buy votes”.
            </p>
          )}
        </div>

        <div className="vote-checkout__payment">
          <h2 className="dash-page__section-title">Payment method</h2>

          <div className="vote-checkout__methods">
            {METHODS.map(({ key, label, icon: Icon, available }) => (
              <button
                key={key}
                type="button"
                className={`vote-checkout__method ${key === 'momo' ? 'is-active' : ''}`}
                disabled={!available}
                title={available ? undefined : 'Not available yet'}
                style={available ? undefined : { opacity: 0.45, cursor: 'not-allowed' }}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>

          <form className="auth-form" onSubmit={pay} noValidate>
            <div className="auth-form__field">
              <label htmlFor="momo-phone">MTN or Airtel number</label>
              <div className="auth-form__input-wrap">
                <Smartphone size={16} />
                <input id="momo-phone" type="tel" placeholder="078 xxx xxxx" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              {errors.phone && <span className="auth-form__error">{errors.phone}</span>}
            </div>
            <p style={{ color: '#a8a49b', fontSize: '0.8rem' }}>You will get a prompt on this phone. Approve it with your mobile-money PIN.</p>

            <button type="submit" className="btn btn--gold auth-form__submit" disabled={sending || off || !payConfig}>
              {sending ? 'Starting payment…' : selected ? `Pay ${formatRwf(selected.priceRwf)}` : 'Select a package to pay'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
