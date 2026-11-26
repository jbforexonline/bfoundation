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

  // ?login=1 (sent by protected pages) opens the login form.
  // ?emailVerified=true|false comes back from the link in the verification email.
  useEffect(() => {
    if (params.get('login') === '1') setAuthModal({ isOpen: true, mode: 'login' });
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
