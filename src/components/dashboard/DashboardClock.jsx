import { useEffect, useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import './DashboardClock.scss';

export default function DashboardClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const date = now.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const time = now.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div className="dash-clock">
      <span className="dash-clock__item">
        <Calendar size={14} />
        {date}
      </span>
      <span className="dash-clock__divider" aria-hidden="true" />
      <span className="dash-clock__item dash-clock__item--time">
        <Clock size={14} />
        {time}
      </span>
    </div>
  );
}
