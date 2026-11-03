import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import './DashboardTopbar.scss';

const DATE_FORMAT = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
const TIME_FORMAT = { hour: '2-digit', minute: '2-digit', second: '2-digit' };

export default function DashboardTopbar({ profile }) {
  const [now, setNow] = useState(() => new Date());

  // Tick the clock every second so the topbar always shows the live time.
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="dash-topbar">
      <div className="dash-topbar__datetime">
        <span className="dash-topbar__date">{now.toLocaleDateString('en-GB', DATE_FORMAT)}</span>
        <span className="dash-topbar__time">{now.toLocaleTimeString('en-GB', TIME_FORMAT)}</span>
      </div>

      <button type="button" className="dash-topbar__profile">
        <span className="dash-topbar__avatar">{profile.initials}</span>
        <span className="dash-topbar__profile-text">
          <strong>{profile.name}</strong>
          <small>Fan account</small>
        </span>
        <ChevronDown size={14} />
      </button>
    </header>
  );
}
