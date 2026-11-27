import MessagingPanel from '../../components/messaging/MessagingPanel';
import '../../components/dashboard/DashboardPage.scss';

export default function FanMessagesPage() {
  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Messages</h1>
          <p className="dash-page__subtitle">Chat directly with the contestants you support.</p>
        </div>
      </div>
      <MessagingPanel emptyLabel="No conversations yet. Open a contestant on the Contestants page and click Message." />
    </div>
  );
}
