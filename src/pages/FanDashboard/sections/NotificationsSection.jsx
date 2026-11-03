import { notifications } from '../fanDashboardData';

export default function NotificationsSection() {
  return (
    <div>
      <div className="dash-header">
        <h1>Notifications</h1>
        <p>Updates about your votes and the contestants you follow.</p>
      </div>

      <div className="dash-cards" style={{ gridTemplateColumns: '1fr' }}>
        {notifications.map((n) => (
          <div className="dash-card" key={n.id}>
            <h3>{n.text}</h3>
            <small>
              {n.time}
              {n.unread && <span className="dash-badge dash-badge--warn" style={{ marginLeft: '8px' }}>Unread</span>}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}
