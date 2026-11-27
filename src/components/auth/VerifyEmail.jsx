import { useState } from 'react';
import { MailCheck, RotateCw } from 'lucide-react';
import { api } from '../../api/client';
import Notice from '../ui/Notice';
import './AuthForm.scss';

export default function VerifyEmail({ email, onContinue }) {
  const [resent, setResent] = useState(false);
  const [error, setError] = useState('');

  const resend = async () => {
    setError('');
    try {
      await api('/auth/resend-verification', { method: 'POST', body: { email }, auth: false });
      setResent(true);
      setTimeout(() => setResent(false), 2500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-form__verify">
      <div className="auth-form__verify-icon">
        <MailCheck size={28} />
      </div>

      <h3 className="auth-form__title">Verify your email</h3>
      <p className="auth-form__subtitle">
        We&rsquo;ve sent a verification link to{' '}
        <strong>{email || 'your email address'}</strong>. Click the link to activate your
        account.
      </p>

      {resent && (
        <p className="auth-form__success" role="status">
          Verification email resent.
        </p>
      )}

      <Notice tone="error">{error}</Notice>

      <div className="auth-form" style={{ marginTop: 8 }}>
        <button type="button" className="btn btn--gold auth-form__submit" onClick={() => onContinue?.()}>
          Continue to Dashboard
        </button>

        <button type="button" className="auth-form__social-btn" onClick={resend}>
          <RotateCw size={15} />
          Resend Email
        </button>
      </div>
    </div>
  );
}
