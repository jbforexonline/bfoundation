import { MessageCircle, Heart, Share2, Repeat } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import DataTable from '../../components/ui/DataTable';
import '../../components/dashboard/DashboardPage.scss';

const ACTIVITY = [
  { id: 1, name: 'Joyce Uwase', action: 'Commented on your post', detail: '"Can\'t wait for the new single!"', time: '2 hours ago' },
  { id: 2, name: 'Eric Niyonzima', action: 'Shared your voting link', detail: 'via WhatsApp', time: '5 hours ago' },
  { id: 3, name: 'Aline Mutesi', action: 'Sent you a message', detail: '"Loved your last performance"', time: '1 day ago' },
  { id: 4, name: 'Patrick Habimana', action: 'Reacted to your post', detail: '❤️ Behind the scenes at rehearsal', time: '2 days ago' },
];

export default function ContestantEngagementPage() {
  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Engagement</h1>
          <p className="dash-page__subtitle">How supporters are interacting with your campaign.</p>
        </div>
      </div>

      <div className="dash-page__stats" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <StatCard icon={Heart} label="Post Reactions" value="1,240" />
        <StatCard icon={MessageCircle} label="Comments" value="386" />
        <StatCard icon={Share2} label="Link Shares" value="612" />
        <StatCard icon={Repeat} label="Repeat Voter Rate" value="42%" />
      </div>

      <div>
        <h2 className="dash-page__section-title">Recent activity</h2>
        <DataTable
          columns={[
            { key: 'name', label: 'Supporter' },
            { key: 'action', label: 'Action' },
            { key: 'detail', label: 'Detail' },
            { key: 'time', label: 'Time' },
          ]}
          rows={ACTIVITY}
        />
      </div>
    </div>
  );
}
