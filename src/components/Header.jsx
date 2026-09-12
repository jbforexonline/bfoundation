import { Link, useLocation } from 'react-router-dom';
import { Search, ChevronDown } from 'lucide-react';
import './Header.scss';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Contestants', to: '/contestants' },
  { label: 'Awards', to: '/categories' },
  { label: 'Ultimate Fan Challenge', to: '/#fan-challenge', badge: 'NEW' },
  { label: 'Hall of Fame', to: '/hall-of-fame' },
  { label: 'Nominatee...', to: '/nominate' },
  { label: 'Vote', to: '/vote' },
  { label: 'How to Vote', to: '/how-to-vote' },
  { label: 'Contact Us', to: '/contact' },
];

export default function Header({ onLoginClick, onSignUpClick }) {
  const { pathname } = useLocation();

  return (
    <header className="header">
      <div className="header__inner">
        <Link className="header__brand" to="/">
          <span className="header__logo" aria-hidden="true">B</span>
          <span className="header__brand-text">
            <span className="header__brand-name">BFOUNDATION.RW</span>
            <span className="header__brand-tag">
              RECOGNIZING EXCELLENCE.<br />
              EMPOWERING <em>POTENTIAL.</em>
            </span>
          </span>
        </Link>

        <div className="header__search">
          <input type="text" placeholder="Search items, collections, and more..." />
          <Search size={18} strokeWidth={2} />
        </div>

        <nav className="header__nav" aria-label="Primary">
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  className={pathname === link.to ? 'is-active' : ''}
                >
                  {link.label}
                  {link.hasDropdown && <ChevronDown size={14} />}
                  {link.badge && <span className="header__badge">{link.badge}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header__actions">
          <button className="header__country" type="button">
            <span className="header__flag" aria-hidden="true">🇷🇼</span>
            RWANDA
            <ChevronDown size={14} />
          </button>
          <button className="header__login" type="button" onClick={onLoginClick}>
            Log In
          </button>
          <button
            className="btn btn--gold header__signup"
            type="button"
            onClick={onSignUpClick}
          >
            Sign Up
          </button>
        </div>
      </div>
    </header>
  );
}
