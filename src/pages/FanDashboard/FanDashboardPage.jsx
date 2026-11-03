import { NavLink, Link, Outlet } from 'react-router-dom';
import { User, History, CreditCard, Star, Bell, Ticket, LogOut } from 'lucide-react';
import { fanProfile } from './fanDashboardData';
import DashboardTopbar from './DashboardTopbar';
import './FanDashboardPage.scss';

const NAV_ITEMS = [
  { to: '/dashboard/profile', label: 'Profile', icon: User },
  { to: '/dashboard/vote-history', label: 'Vote History', icon: History },
  { to: '/dashboard/purchased-votes', label: 'Purchased Votes', icon: CreditCard },
  { to: '/dashboard/favorites', label: 'Favorite Contestants', icon: Star },
  { to: '/dashboard/notifications', label: 'Notifications', icon: Bell },
  { to: '/dashboard/tickets', label: 'Event Tickets', icon: Ticket },
];

// Standalone dashboard layout: no site Header/Footer here — just a sidebar
// for navigation and a topbar (date, time, user profile). Each dashboard
// route renders below via <Outlet />.
export default function FanDashboardPage() {
  return (
    <div className="dashboard-layout">
      <aside className="dashboard-layout__sidebar">
        <Link to="/" className="dashboard-layout__brand">
          <span className="dashboard-layout__logo" aria-hidden="true">B</span>
          <span className="dashboard-layout__brand-text">BFOUNDATION.RW</span>
        </Link>

        <nav aria-label="Fan dashboard" className="dashboard-layout__nav">
          <ul>
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink to={to} className={({ isActive }) => (isActive ? 'is-active' : '')}>
                  <Icon size={17} strokeWidth={2} />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <Link to="/" className="dashboard-layout__exit">
          <LogOut size={17} strokeWidth={2} />
          Back to site
        </Link>
      </aside>

      <div className="dashboard-layout__main">
        <DashboardTopbar profile={fanProfile} />

        <main className="dashboard-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
