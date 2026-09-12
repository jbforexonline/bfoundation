import { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import './AuthForm.scss';

export default function ForgotPassword({ onBackToLogin }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Enter the email address on your account.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Enter a valid email address.');
      return;
    }
    setError('');
    // TODO: wire up to your real password-reset endpoint.
    console.log('Password reset requested for', email);
    setSent(true);
  };

  return (
    <div>
      <h3 className="auth-form__title">Reset your password</h3>
      <p className="auth-form__subtitle">
        Enter the email address linked to your account and we&rsquo;ll send you a reset link.
      </p>

      {sent ? (
        <div>
          <p className="auth-form__success" role="status">
            If an account exists for <strong>{email}</strong>, a reset link is on its way.
          </p>
          <button type="button" className="auth-form__switch-btn" onClick={onBackToLogin}>
            <ArrowLeft size={15} />
            Back to log in
          </button>
        </div>
      ) : (
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-form__field">
            <label htmlFor="forgot-email">Email address</label>
            <div className="auth-form__input-wrap">
              <Mail size={16} />
              <input
                id="forgot-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {error && <span className="auth-form__error">{error}</span>}
          </div>

          <button type="submit" className="btn btn--gold auth-form__submit">
            Send Reset Link
          </button>

          <p className="auth-form__switch">
            Remembered it?{' '}
            <button type="button" onClick={onBackToLogin}>Back to log in</button>
          </p>
        </form>
      )}
    </div>
  );
}
