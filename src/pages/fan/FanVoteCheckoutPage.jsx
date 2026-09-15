import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Check, Smartphone, CreditCard, Globe2, ArrowLeft } from 'lucide-react';
import '../../components/dashboard/DashboardPage.scss';
import '../../components/auth/AuthForm.scss';
import './FanVoteCheckoutPage.scss';

const PACKAGES = [
  { votes: 1, price: '2,000 RWF' },
  { votes: 10, price: '20,000 RWF' },
  { votes: 50, price: '90,000 RWF' },
  { votes: 100, price: '180,000 RWF' },
  { votes: 500, price: '800,000 RWF' },
];

const METHODS = [
  { key: 'momo', label: 'Mobile Money', icon: Smartphone },
  { key: 'card', label: 'Cards', icon: CreditCard },
  { key: 'intl', label: 'International Payments', icon: Globe2 },
];

export default function FanVoteCheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const contestant = location.state?.contestant;

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [method, setMethod] = useState('momo');
  const [fields, setFields] = useState({ phone: '', cardNumber: '', expiry: '', cvv: '', nameOnCard: '', country: 'Rwanda' });
  const [errors, setErrors] = useState({});
  const [paid, setPaid] = useState(false);

  const update = (field) => (e) => setFields((prev) => ({ ...prev, [field]: e.target.value }));

  if (!contestant) {
    return (
      <div className="dash-page">
        <div className="dash-page__header">
          <div>
            <h1 className="dash-page__title">Vote</h1>
            <p className="dash-page__subtitle">Pick a contestant to vote for first.</p>
          </div>
        </div>
        <Link to="/dashboard/fan/contestants" className="btn btn--gold" style={{ width: 'fit-content' }}>
          Browse Contestants
        </Link>
      </div>
    );
  }

  const validate = () => {
    const next = {};
    if (!selectedPackage) next.package = 'Choose how many votes to buy.';
    if (method === 'momo' && !fields.phone.trim()) next.phone = 'Enter the mobile money number.';
    if ((method === 'card' || method === 'intl') && !fields.cardNumber.trim()) next.cardNumber = 'Enter your card number.';
    if ((method === 'card' || method === 'intl') && !fields.expiry.trim()) next.expiry = 'Enter the expiry date.';
    if ((method === 'card' || method === 'intl') && !fields.cvv.trim()) next.cvv = 'Enter the CVV.';
    return next;
  };

  const handlePay = (e) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length === 0) {
      // TODO: send this to your real payment gateway (Mobile Money / card processor).
      console.log('Vote purchase', { contestant, package: selectedPackage, method, fields });
      setPaid(true);
    }
  };

  if (paid) {
    return (
      <div className="dash-page">
        <div className="vote-checkout__success">
          <div className="vote-checkout__success-icon">
            <Check size={28} />
          </div>
          <h2>Payment successful!</h2>
          <p>
            {selectedPackage.votes} vote{selectedPackage.votes > 1 ? 's' : ''} for{' '}
            <strong>{contestant.name}</strong> ({selectedPackage.price}) have been added.
          </p>
          <div className="vote-checkout__success-actions">
            <Link to="/dashboard/fan/purchased-votes" className="btn btn--outline">
              View Purchased Votes
            </Link>
            <Link to="/dashboard/fan/contestants" className="btn btn--gold">
              Back to Contestants
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <button type="button" className="vote-checkout__back" onClick={() => navigate(-1)}>
            <ArrowLeft size={15} /> Back
          </button>
          <h1 className="dash-page__title">Vote for {contestant.name}</h1>
          <p className="dash-page__subtitle">{contestant.category} — choose a vote package and payment method.</p>
        </div>
      </div>

      <div className="vote-checkout">
        <div className="vote-checkout__packages">
          <h2 className="dash-page__section-title">Paid Votes</h2>
          <div className="vote-checkout__table">
            <div className="vote-checkout__table-head">
              <span>Votes</span>
              <span>Price</span>
            </div>
            {PACKAGES.map((pkg) => (
              <button
                type="button"
                key={pkg.votes}
                className={`vote-checkout__table-row ${selectedPackage?.votes === pkg.votes ? 'is-selected' : ''}`}
                onClick={() => setSelectedPackage(pkg)}
              >
                <span>{pkg.votes.toLocaleString()}</span>
                <span>{pkg.price}</span>
              </button>
            ))}
          </div>
          {errors.package && <span className="auth-form__error">{errors.package}</span>}
        </div>

        <div className="vote-checkout__payment">
          <h2 className="dash-page__section-title">Payment Method</h2>

          <div className="vote-checkout__methods">
            {METHODS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                className={`vote-checkout__method ${method === key ? 'is-active' : ''}`}
                onClick={() => setMethod(key)}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>

          <form className="auth-form" onSubmit={handlePay} noValidate>
            {method === 'momo' && (
              <div className="auth-form__field">
                <label htmlFor="momo-phone">Mobile money number</label>
                <div className="auth-form__input-wrap">
                  <Smartphone size={16} />
                  <input
                    id="momo-phone"
                    type="tel"
                    placeholder="+250 7xx xxx xxx"
                    value={fields.phone}
                    onChange={update('phone')}
                  />
                </div>
                {errors.phone && <span className="auth-form__error">{errors.phone}</span>}
              </div>
            )}

            {(method === 'card' || method === 'intl') && (
              <>
                <div className="auth-form__field">
                  <label htmlFor="card-name">Name on card</label>
                  <div className="auth-form__input-wrap">
                    <CreditCard size={16} />
                    <input id="card-name" type="text" value={fields.nameOnCard} onChange={update('nameOnCard')} />
                  </div>
                </div>

                <div className="auth-form__field">
                  <label htmlFor="card-number">Card number</label>
                  <div className="auth-form__input-wrap">
                    <CreditCard size={16} />
                    <input
                      id="card-number"
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={fields.cardNumber}
                      onChange={update('cardNumber')}
                    />
                  </div>
                  {errors.cardNumber && <span className="auth-form__error">{errors.cardNumber}</span>}
                </div>

                <div className="auth-form__row">
                  <div className="auth-form__field">
                    <label htmlFor="card-expiry">Expiry</label>
                    <div className="auth-form__input-wrap">
                      <CreditCard size={16} />
                      <input id="card-expiry" type="text" placeholder="MM/YY" value={fields.expiry} onChange={update('expiry')} />
                    </div>
                    {errors.expiry && <span className="auth-form__error">{errors.expiry}</span>}
                  </div>

                  <div className="auth-form__field">
                    <label htmlFor="card-cvv">CVV</label>
                    <div className="auth-form__input-wrap">
                      <CreditCard size={16} />
                      <input id="card-cvv" type="text" placeholder="123" value={fields.cvv} onChange={update('cvv')} />
                    </div>
                    {errors.cvv && <span className="auth-form__error">{errors.cvv}</span>}
                  </div>
                </div>

                {method === 'intl' && (
                  <div className="auth-form__field">
                    <label htmlFor="billing-country">Billing country</label>
                    <div className="auth-form__input-wrap auth-form__input-wrap--select">
                      <Globe2 size={16} />
                      <select id="billing-country" value={fields.country} onChange={update('country')}>
                        <option>Rwanda</option>
                        <option>United States</option>
                        <option>United Kingdom</option>
                        <option>Belgium</option>
                        <option>Canada</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                )}
              </>
            )}

            <button type="submit" className="btn btn--gold auth-form__submit">
              {selectedPackage ? `Pay ${selectedPackage.price}` : 'Select a package to pay'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
