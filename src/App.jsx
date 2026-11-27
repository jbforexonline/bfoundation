import { useEffect, useState } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';
import Notice from './components/ui/Notice';
import Header from './components/Header';
import Footer from './components/Footer';
import AuthModal from './components/auth/AuthModal';
import './App.scss';

export default function App() {
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'signup' });

  const openAuth = (mode) => setAuthModal({ isOpen: true, mode });
  const closeAuth = () => setAuthModal((prev) => ({ ...prev, isOpen: false }));
  const switchAuthMode = (mode) => setAuthModal({ isOpen: true, mode });
  const [params, setParams] = useSearchParams();
  const [banner, setBanner] = useState(null);

  // ?login=1 (sent by protected pages and the /login link in emails) opens the login form.
  // ?emailVerified=true|false comes back from the link in the verification email.
  const wantsLogin = params.get('login') === '1';
  useEffect(() => {
    if (wantsLogin) setAuthModal({ isOpen: true, mode: 'login' });
  }, [wantsLogin]);

  // ?ref=CODE (a fan's invite link) is kept until sign-up; ?newsletter= comes back from the email links.
  useEffect(() => {
    const next = new URLSearchParams(params);
    let changed = false;
    const ref = params.get('ref');
    if (ref) {
      try {
        localStorage.setItem('bf_ref', ref);
      } catch {
        /* ignore */
      }
      setBanner({ tone: 'info', text: 'A friend invited you to BFOUNDATION.RW. Sign up to vote for your favorite talent!' });
      setAuthModal({ isOpen: true, mode: 'signup' });
      next.delete('ref');
      changed = true;
    }
    const newsletter = params.get('newsletter');
    if (newsletter) {
      const texts = {
        confirmed: ['success', 'You are subscribed to the BFOUNDATION.RW newsletter. Thank you!'],
        unsubscribed: ['info', 'You have been unsubscribed from the newsletter.'],
        invalid: ['error', 'This newsletter link is invalid or has expired.'],
      };
      const [tone, text] = texts[newsletter] ?? texts.invalid;
      setBanner({ tone, text });
      next.delete('newsletter');
      changed = true;
    }
    if (changed) setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const verified = params.get('emailVerified');
    if (verified) {
      setBanner(
        verified === 'true'
          ? { tone: 'success', text: 'Your email address is verified. Thank you!' }
          : { tone: 'error', text: 'This verification link is invalid or has expired. Log in and ask for a new one.' }
      );
      const next = new URLSearchParams(params);
      next.delete('emailVerified');
      next.delete('reason');
      setParams(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="app">
      <Header
        onLoginClick={() => openAuth('login')}
        onSignUpClick={() => openAuth('signup')}
      />

      {banner && (
        <div style={{ maxWidth: 1280, margin: '16px auto 0', padding: '0 24px' }}>
          <Notice tone={banner.tone}>{banner.text}</Notice>
        </div>
      )}

      <Outlet context={{ openAuth }} />

      <Footer />

      <AuthModal
        isOpen={authModal.isOpen}
        mode={authModal.mode}
        onClose={closeAuth}
        onSwitchMode={switchAuthMode}
      />
    </div>
  );
}
