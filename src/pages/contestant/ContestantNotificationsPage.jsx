import { useState } from 'react';
import { Bell, Trophy, Users, Megaphone, Wallet } from 'lucide-react';
import '../../components/dashboard/DashboardPage.scss';

const INITIAL_NOTIFICATIONS = [
  { id: 1, icon: Trophy, title: "You've moved into #1 for Best Musician", time: '1 hour ago', unread: true },
  { id: 2, icon: Users, title: '38 new supporters voted for you today', time: '4 hours ago', unread: true },
  { id: 3, icon: Wallet, title: 'Your prize eligibility was confirmed for this cycle', time: '2 days ago', unread: false },
  { id: 4, icon: Megaphone, title: 'Reminder: campaign updates get 3x more engagement with a photo', time: '4 days ago', unread: false },
];

export default function ContestantNotificationsPage() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const markRead = (id) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Notifications</h1>
          <p className="dash-page__subtitle">Standings changes, supporter activity, and campaign tips.</p>
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
