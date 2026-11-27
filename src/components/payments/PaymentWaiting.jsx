import { useEffect, useRef, useState } from 'react';
import { Smartphone, Check, X, RefreshCw, FlaskConical } from 'lucide-react';
import Notice from '../ui/Notice';
import { checkPayment, simulatePayment } from '../../api/payments';
import { formatRwf } from '../../api/client';
import './PaymentWaiting.scss';

const POLL_MS = 4000;
const GIVE_UP_MS = 3 * 60 * 1000; // stop asking automatically after 3 minutes (the payer can still check)

/**
 * Shown after a payment was started: "approve the prompt on your phone", then success / failure.
 * props: payment (from the backend), instructions (text from the backend), mode ('live' | 'test'),
 *        onFinished(status) called once with 'SUCCESSFUL' or 'FAILED', onCancel (optional).
 */
export default function PaymentWaiting({ payment: initial, instructions, mode, onFinished, onCancel }) {
  const [payment, setPayment] = useState(initial);
  const [error, setError] = useState('');
  const [timedOut, setTimedOut] = useState(false);
  const [busy, setBusy] = useState(false);
  const finished = useRef(false);

  const update = (p) => {
    setPayment(p);
    if (p.status !== 'PENDING' && !finished.current) {
      finished.current = true;
      onFinished?.(p.status, p);
    }
  };

  // Ask the backend every few seconds until the payment is no longer PENDING.
  useEffect(() => {
    if (payment.status !== 'PENDING' || timedOut) return undefined;
    const started = Date.now();
    const timer = setInterval(async () => {
      if (Date.now() - started > GIVE_UP_MS) {
        setTimedOut(true);
        return;
      }
      try {
        update(await checkPayment(payment.id));
      } catch {
        /* network hiccup: try again next tick */
      }
    }, POLL_MS);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payment.id, payment.status, timedOut]);

  const checkNow = async () => {
    setBusy(true);
    setError('');
    try {
      update(await checkPayment(payment.id));
      setTimedOut(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const simulate = async (outcome) => {
    setBusy(true);
    setError('');
    try {
      update(await simulatePayment(payment.id, outcome));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (payment.status === 'SUCCESSFUL') {
    return (
      <div className="payment-waiting payment-waiting--ok">
        <div className="payment-waiting__icon"><Check size={26} /></div>
        <p className="payment-waiting__title">Payment received — {formatRwf(payment.amount)}</p>
        <p className="payment-waiting__text">Reference: {payment.providerRef ?? payment.id.slice(0, 8)}</p>
      </div>
    );
  }
  if (payment.status === 'FAILED') {
    return (
      <div className="payment-waiting payment-waiting--failed">
        <div className="payment-waiting__icon"><X size={26} /></div>
        <p className="payment-waiting__title">The payment did not go through</p>
        <p className="payment-waiting__text">{payment.failureReason || 'It was declined or not approved in time. No money was taken.'}</p>
      </div>
    );
  }

  return (
    <div className="payment-waiting">
      <div className="payment-waiting__icon payment-waiting__icon--pulse">
        <Smartphone size={26} />
      </div>
      <p className="payment-waiting__title">
        {mode === 'test' ? 'Test payment started' : `Approve ${formatRwf(payment.amount)} on ${payment.phone}`}
      </p>
      <p className="payment-waiting__text">{instructions}</p>
      {!timedOut && mode !== 'test' && <p className="payment-waiting__hint">Waiting for confirmation… this page updates by itself.</p>}
      {timedOut && <p className="payment-waiting__hint">Still waiting. If you approved it, click “Check again”.</p>}
      <Notice tone="error">{error}</Notice>

      <div className="payment-waiting__actions">
        {mode === 'test' ? (
          <>
            <button type="button" className="btn btn--gold" disabled={busy} onClick={() => simulate('success')}>
              <FlaskConical size={15} /> Simulate success
            </button>
            <button type="button" className="btn btn--outline" disabled={busy} onClick={() => simulate('failure')}>
              Simulate failure
            </button>
          </>
        ) : (
          <button type="button" className="btn btn--outline" disabled={busy} onClick={checkNow}>
            <RefreshCw size={15} /> Check again
          </button>
        )}
        {onCancel && (
          <button type="button" className="btn btn--outline" disabled={busy} onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
      {mode === 'test' && <p className="payment-waiting__hint">Test mode: no real money moves. Ask the admin to switch on Paypack for real payments.</p>}
    </div>
  );
}
