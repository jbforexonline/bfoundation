import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Chrome, Facebook, User, Star, ShieldCheck } from 'lucide-react';
import './AuthForm.scss';

const ROLES = [
  { key: 'fan', label: 'Fan', icon: User },
  { key: 'contestant', label: 'Contestant', icon: Star },
  { key: 'admin', label: 'Admin', icon: ShieldCheck },
];

export default function Login({ onSwitchMode, onForgotPassword, onClose }) {
  const [role, setRole] = useState('fan'); // 'fan' | 'contestant' | 'admin'
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const roleLabel = ROLES.find((r) => r.key === role)?.label ?? 'Fan';

  const update = (field) => (e) => {
    const value = field === 'remember' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const next = {};
    if (!form.email.trim()) next.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (!form.password) next.password = 'Password is required.';
    return next;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length === 0) {
      // TODO: wire up to your real authentication endpoint — verify credentials
      // AND that this account actually holds the selected role before redirecting.
      console.log('Log in with', { ...form, role });
      setSubmitted(true);
      setTimeout(() => onClose?.(role), 1200);
    }
  };

  return (
    <div>
      <h3 className="auth-form__title">Log in to your account</h3>
      <p className="auth-form__subtitle">
        Vote for your favorites and track the talents you support.
      </p>

      <div className="auth-form__role-toggle" role="tablist" aria-label="Log in as">
        {ROLES.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={role === key}
            className={role === key ? 'is-active' : ''}
            onClick={() => setRole(key)}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {submitted && (
        <p className="auth-form__success" role="status">
          Welcome back! Taking you to the {roleLabel} Dashboard&hellip;
        </p>
      )}

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="auth-form__field">
          <label htmlFor="login-email">Email address</label>
          <div className="auth-form__input-wrap">
            <Mail size={16} />
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={update('email')}
            />
          </div>
          {errors.email && <span className="auth-form__error">{errors.email}</span>}
        </div>

        <div className="auth-form__field">
          <label htmlFor="login-password">Password</label>
          <div className="auth-form__input-wrap">
            <Lock size={16} />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={form.password}
              onChange={update('password')}
            />
            <button
              type="button"
              className="auth-form__toggle-visibility"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <span className="auth-form__error">{errors.password}</span>}
        </div>

        <div className="auth-form__meta-row">
          <label className="auth-form__checkbox">
            <input type="checkbox" checked={form.remember} onChange={update('remember')} />
            Remember me
          </label>
          <button type="button" className="auth-form__forgot" onClick={onForgotPassword}>
            Forgot password?
          </button>
        </div>

        <button type="submit" className="btn btn--gold auth-form__submit">
          Log In as {roleLabel}
        </button>

        <div className="auth-form__divider">or continue with</div>

        <div className="auth-form__social-row">
          <button type="button" className="auth-form__social-btn">
            <Chrome size={16} />
            Google
          </button>
          <button type="button" className="auth-form__social-btn">
            <Facebook size={16} />
            Facebook
          </button>
        </div>

        <p className="auth-form__switch">
          Don&rsquo;t have an account?{' '}
          <button type="button" onClick={onSwitchMode}>Sign up</button>
        </p>
      </form>
    </div>
  );
}
