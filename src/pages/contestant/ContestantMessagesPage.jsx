import MessagingPanel from '../../components/messaging/MessagingPanel';
import '../../components/dashboard/DashboardPage.scss';

export default function ContestantMessagesPage() {
  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Messages</h1>
          <p className="dash-page__subtitle">Reply to the fans supporting your campaign.</p>
        </div>
      </div>
      <MessagingPanel emptyLabel="No messages yet. Fans can message you from your profile." />
    </div>
  );
}
