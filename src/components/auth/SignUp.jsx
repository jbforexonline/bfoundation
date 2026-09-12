import { useState } from 'react';
import { User, Mail, Phone, Lock, Eye, EyeOff, Globe, Chrome, Facebook } from 'lucide-react';
import './AuthForm.scss';

const COUNTRIES = ['Rwanda', 'Burundi', 'Uganda', 'Kenya', 'Tanzania'];

const INITIAL_FORM = {
  fullName: '',
  email: '',
  phone: '',
  country: 'Rwanda',
  password: '',
  confirmPassword: '',
  agree: false,
};

export default function SignUp({ onSwitchMode, onClose, onSignedUp }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const update = (field) => (e) => {
    const value = field === 'agree' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = 'Full name is required.';
    if (!form.email.trim()) next.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (!form.phone.trim()) next.phone = 'Phone number is required.';
    if (!form.password) next.password = 'Password is required.';
    else if (form.password.length < 8) next.password = 'Use at least 8 characters.';
    if (form.confirmPassword !== form.password) next.confirmPassword = 'Passwords do not match.';
    if (!form.agree) next.agree = 'You must accept the terms to continue.';
    return next;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length === 0) {
      // TODO: wire up to your real sign-up endpoint.
      console.log('Sign up with', form);
      setSubmitted(true);
      const email = form.email;
      setTimeout(() => onSignedUp?.(email), 900);
    }
  };

  return (
    <div>
      <h3 className="auth-form__title">Create your account</h3>
      <p className="auth-form__subtitle">
        Nominate talent, cast your votes, and follow the Hall of Fame.
      </p>

      {submitted && (
        <p className="auth-form__success" role="status">
          Account created! Check your email to verify your address.
        </p>
      )}

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="auth-form__field">
          <label htmlFor="signup-name">Full name</label>
          <div className="auth-form__input-wrap">
            <User size={16} />
            <input
              id="signup-name"
              type="text"
              autoComplete="name"
              placeholder="Jean Claude Uwimana"
              value={form.fullName}
              onChange={update('fullName')}
            />
          </div>
          {errors.fullName && <span className="auth-form__error">{errors.fullName}</span>}
        </div>

        <div className="auth-form__field">
          <label htmlFor="signup-email">Email address</label>
          <div className="auth-form__input-wrap">
            <Mail size={16} />
            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={update('email')}
            />
          </div>
          {errors.email && <span className="auth-form__error">{errors.email}</span>}
        </div>

        <div className="auth-form__row">
          <div className="auth-form__field">
            <label htmlFor="signup-phone">Phone number</label>
            <div className="auth-form__input-wrap">
              <Phone size={16} />
              <input
                id="signup-phone"
                type="tel"
                autoComplete="tel"
                placeholder="+250 7xx xxx xxx"
                value={form.phone}
                onChange={update('phone')}
              />
            </div>
            {errors.phone && <span className="auth-form__error">{errors.phone}</span>}
          </div>

          <div className="auth-form__field">
            <label htmlFor="signup-country">Country</label>
            <div className="auth-form__input-wrap auth-form__input-wrap--select">
              <Globe size={16} />
              <select id="signup-country" value={form.country} onChange={update('country')}>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="auth-form__row">
          <div className="auth-form__field">
            <label htmlFor="signup-password">Password</label>
            <div className="auth-form__input-wrap">
              <Lock size={16} />
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="At least 8 characters"
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

          <div className="auth-form__field">
            <label htmlFor="signup-confirm">Confirm password</label>
            <div className="auth-form__input-wrap">
              <Lock size={16} />
              <input
                id="signup-confirm"
                type={showConfirm ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Re-enter password"
                value={form.confirmPassword}
                onChange={update('confirmPassword')}
              />
              <button
                type="button"
                className="auth-form__toggle-visibility"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="auth-form__error">{errors.confirmPassword}</span>
            )}
          </div>
        </div>

        <label className="auth-form__checkbox">
          <input type="checkbox" checked={form.agree} onChange={update('agree')} />
          I agree to the <a href="#terms">Terms &amp; Conditions</a> and <a href="#privacy">Privacy Policy</a>
        </label>
        {errors.agree && <span className="auth-form__error">{errors.agree}</span>}

        <button type="submit" className="btn btn--gold auth-form__submit">
          Create Account
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
          Already have an account?{' '}
          <button type="button" onClick={onSwitchMode}>Log in</button>
        </p>
      </form>
    </div>
  );
}
