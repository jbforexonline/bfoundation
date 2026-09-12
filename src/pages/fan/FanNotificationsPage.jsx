import { useState } from 'react';
import { Bell, Vote, Trophy, Ticket, Megaphone } from 'lucide-react';
import '../../components/dashboard/DashboardPage.scss';

const INITIAL_NOTIFICATIONS = [
  { id: 1, icon: Vote, title: 'Voting closes in 3 days for Best Musician', time: '2 hours ago', unread: true },
  { id: 2, icon: Trophy, title: 'Ishimwe Kevin just entered the top 3 for Best Footballer', time: '1 day ago', unread: true },
  { id: 3, icon: Ticket, title: 'Your ticket for the Awards Night is confirmed', time: '3 days ago', unread: false },
  { id: 4, icon: Megaphone, title: 'A new nomination round is open — suggest a contestant', time: '5 days ago', unread: false },
];

export default function FanNotificationsPage() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const markRead = (id) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Notifications</h1>
          <p className="dash-page__subtitle">Stay up to date on voting deadlines, standings, and your tickets.</p>
        </div>
        <button
          type="button"
          className="btn btn--outline"
          onClick={() => setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))}
        >
          Mark all as read
        </button>
      </div>

      <div className="dash-page__list">
        {notifications.map(({ id, icon: Icon, title, time, unread }) => (
          <div className={`dash-item ${unread ? 'dash-item--unread' : ''}`} key={id}>
            <div className="dash-item__icon">
              <Icon size={18} />
            </div>
            <div className="dash-item__body">
              <p className="dash-item__title">{title}</p>
              <p className="dash-item__meta">{time}</p>
            </div>
            {unread && (
              <button type="button" className="btn btn--outline dash-item__action" onClick={() => markRead(id)}>
                <Bell size={14} />
                Mark read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
