import { useState } from 'react';
import { Link, useOutletContext, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff } from 'lucide-react';
import PageHero from '../components/PageHero';
import Notice from '../components/ui/Notice';
import { api } from '../api/client';
import '../components/auth/AuthForm.scss';
import './ApplicationPage.scss';

// Opened from the "Reset your password" / "Set your password" email: /reset-password?token=...
export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const { openAuth } = useOutletContext() ?? {};
  const token = params.get('token') ?? '';
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (form.password.length < 8) next.password = 'Use at least 8 characters.';
    if (form.confirmPassword !== form.password) next.confirmPassword = 'Passwords do not match.';
    setErrors(next);
    setApiError('');
    if (Object.keys(next).length) return;
    setLoading(true);
    try {
      await api('/auth/reset-password', { method: 'POST', body: { token, ...form }, auth: false });
      setDone(true);
    } catch (err) {
      setErrors(err.fieldErrors ?? {});
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHero eyebrow="Account" title="Choose a new password" description="Set the password you will use to log in to BFOUNDATION.RW." />

      <section className="application-page section">
        <div className="application-page__inner" style={{ gridTemplateColumns: 'minmax(0, 560px)', justifyContent: 'center' }}>
          <div className="application-page__form-card">
            {!token ? (
              <Notice tone="error">
                This link is incomplete. Open the link from your email again, or ask for a new one with “Forgot password?”.
              </Notice>
            ) : done ? (
              <>
                <Notice tone="success">Your password has been saved. You can now log in with it.</Notice>
                {openAuth ? (
                  <button type="button" className="btn btn--gold" onClick={() => openAuth('login')}>
                    Log in
                  </button>
                ) : (
                  <Link to="/?login=1" className="btn btn--gold">
                    Log in
                  </Link>
                )}
              </>
            ) : (
              <>
                <Notice tone="error">{apiError}</Notice>
                <form className="auth-form" onSubmit={handleSubmit} noValidate>
                  <div className="auth-form__field">
                    <label htmlFor="reset-password">New password</label>
                    <div className="auth-form__input-wrap">
                      <Lock size={16} />
                      <input
                        id="reset-password"
                        type={show ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder="At least 8 characters"
                        value={form.password}
                        onChange={update('password')}
                      />
                      <button
                        type="button"
                        className="auth-form__toggle-visibility"
                        onClick={() => setShow((v) => !v)}
                        aria-label={show ? 'Hide password' : 'Show password'}
                      >
                        {show ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.password && <span className="auth-form__error">{errors.password}</span>}
                  </div>
                  <div className="auth-form__field">
                    <label htmlFor="reset-confirm">Confirm new password</label>
                    <div className="auth-form__input-wrap">
                      <Lock size={16} />
                      <input
                        id="reset-confirm"
                        type={show ? 'text' : 'password'}
                        autoComplete="new-password"
                        value={form.confirmPassword}
                        onChange={update('confirmPassword')}
                      />
                    </div>
                    {errors.confirmPassword && <span className="auth-form__error">{errors.confirmPassword}</span>}
                  </div>
                  <button type="submit" className="btn btn--gold auth-form__submit" disabled={loading}>
                    {loading ? 'Saving…' : 'Save new password'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
