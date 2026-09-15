import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import DashboardClock from './DashboardClock';
import './DashboardLayout.scss';

function initialsOf(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

/**
 * Self-contained dashboard shell — no site Header/Footer.
 * navGroups: [{ label?, items: [{ label, to, icon, end? }] }]
 * A group without a label renders as a plain flat list (used by Fan/Admin).
 */
export default function DashboardLayout({ navGroups, roleLabel, userName = 'Guest', children }) {
  const navigate = useNavigate();

  const handleSignOut = () => {
    // TODO: clear the real auth session/token here before redirecting.
    navigate('/');
  };

  return (
    <div className="dash">
      <aside className="dash__sidebar">
        <div className="dash__brand">
          <span className="dash__brand-logo" aria-hidden="true">B</span>
          <span className="dash__brand-name">BFOUNDATION.RW</span>
        </div>

        <nav className="dash__nav" aria-label={`${roleLabel} dashboard`}>
          {navGroups.map((group, gi) => (
            <div className="dash__nav-group" key={group.label ?? gi}>
              {group.label && <p className="dash__nav-group-label">{group.label}</p>}
              <ul>
                {group.items.map(({ label, to, icon: Icon, end }) => (
                  <li key={label}>
                    <NavLink to={to} end={end} className={({ isActive }) => (isActive ? 'is-active' : '')}>
                      <Icon size={16} />
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <button type="button" className="dash__signout" onClick={handleSignOut}>
          <LogOut size={16} />
          Sign Out
        </button>
      </aside>

      <div className="dash__main">
        <header className="dash__topbar">
          <DashboardClock />

          <div className="dash__profile">
            <div className="dash__profile-text">
              <p className="dash__profile-name">{userName}</p>
              <span className="dash__profile-role">{roleLabel}</span>
            </div>
            <div className="dash__profile-avatar">{initialsOf(userName)}</div>
          </div>
        </header>

        <div className="dash__content">{children}</div>
      </div>
    </div>
  );
}
