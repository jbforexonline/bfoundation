import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import AuthModal from './components/auth/AuthModal';
import './App.scss';

export default function App() {
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'signup' });

  const openAuth = (mode) => setAuthModal({ isOpen: true, mode });
  const closeAuth = () => setAuthModal((prev) => ({ ...prev, isOpen: false }));
  const switchAuthMode = (mode) => setAuthModal({ isOpen: true, mode });

  return (
    <div className="app">
      <Header
        onLoginClick={() => openAuth('login')}
        onSignUpClick={() => openAuth('signup')}
      />

      <Outlet />

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
