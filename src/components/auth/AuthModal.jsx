import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Star, Users2, Sun, Heart } from 'lucide-react';
import Login from './Login';
import SignUp from './SignUp';
import ForgotPassword from './ForgotPassword';
import VerifyEmail from './VerifyEmail';
import './AuthModal.scss';

const PILLARS = [
  { icon: Star, label: 'Recognizing Talent' },
  { icon: Users2, label: 'Empowering Communities' },
  { icon: Sun, label: 'Inspiring Generations' },
  { icon: Heart, label: 'Giving Back to Society' },
];

const TITLES = {
  login: 'Log in',
  signup: 'Sign up',
  forgot: 'Reset password',
  verify: 'Verify email',
};

const DASHBOARD_PATHS = {
  fan: '/dashboard/fan/profile',
  contestant: '/dashboard/contestant/profile',
  admin: '/dashboard/admin/contestants',
};

export default function AuthModal({ isOpen, mode, onClose, onSwitchMode }) {
  const navigate = useNavigate();
  const [pendingEmail, setPendingEmail] = useState('');

  // Close on Escape, lock body scroll while open.
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const goToDashboard = (role = 'fan') => {
    onClose();
    navigate(DASHBOARD_PATHS[role] ?? DASHBOARD_PATHS.fan);
  };

  return (
    <div
      className="auth-modal"
      role="dialog"
      aria-modal="true"
      aria-label={TITLES[mode] ?? 'Account'}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="auth-modal__card">
        <button
          type="button"
          className="auth-modal__close"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="auth-modal__brand">
          <div className="auth-modal__brand-logo">
            <span aria-hidden="true">B</span>
          </div>
          <h2>
            <span className="auth-modal__line auth-modal__line--white">Recognizing excellence.</span>
            <span className="auth-modal__line auth-modal__line--gold">Empowering potential.</span>
            <span className="auth-modal__line auth-modal__line--green">Inspiring Rwanda.</span>
          </h2>
          <p>
            Join Africa&rsquo;s Digital Recognition Platform to nominate, vote and
            celebrate the talent shaping your community.
          </p>
          <ul className="auth-modal__pillars">
            {PILLARS.map(({ icon: Icon, label }) => (
              <li key={label}>
                <Icon size={15} />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="auth-modal__panel">
          {mode === 'login' && (
            <Login
              onSwitchMode={() => onSwitchMode('signup')}
              onForgotPassword={() => onSwitchMode('forgot')}
              onClose={goToDashboard}
            />
          )}

          {mode === 'signup' && (
            <SignUp
              onSwitchMode={() => onSwitchMode('login')}
              onClose={onClose}
              onSignedUp={(email) => {
                setPendingEmail(email);
                onSwitchMode('verify');
              }}
            />
          )}

          {mode === 'forgot' && (
            <ForgotPassword onBackToLogin={() => onSwitchMode('login')} />
          )}

          {mode === 'verify' && (
            <VerifyEmail email={pendingEmail} onContinue={goToDashboard} />
          )}
        </div>
      </div>
    </div>
  );
}
