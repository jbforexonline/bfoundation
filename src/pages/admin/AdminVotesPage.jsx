import { Vote, TrendingUp, Award, Calendar } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import DataTable from '../../components/ui/DataTable';
import '../../components/dashboard/DashboardPage.scss';

const VOTES = [
  { id: 1, date: '2026-09-08 14:12', contestant: 'Ishimwe Kevin', category: 'Best Footballer', votes: 50, channel: 'Mobile Money' },
  { id: 2, date: '2026-09-08 13:47', contestant: 'Malaika Uwase', category: 'Best Musician', votes: 10, channel: 'Card' },
  { id: 3, date: '2026-09-08 12:30', contestant: 'Grace Umutoni', category: 'Best Influencer', votes: 100, channel: 'Mobile Money' },
  { id: 4, date: '2026-09-08 11:05', contestant: 'Divine Ingabire', category: 'Best Comedian', votes: 25, channel: 'Mobile Money' },
  { id: 5, date: '2026-09-08 09:52', contestant: 'Bruce Karenzi', category: 'Best Musician', votes: 10, channel: 'Card' },
  { id: 6, date: '2026-09-07 20:18', contestant: 'Emmanuel Ndayisenga', category: 'Best Footballer', votes: 50, channel: 'Mobile Money' },
];

export default function AdminVotesPage() {
  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Votes</h1>
          <p className="dash-page__subtitle">Every vote transaction cast across the platform.</p>
        </div>
      </div>

      <div className="dash-page__stats" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <StatCard icon={Vote} label="Votes Today" value="1,240" />
        <StatCard icon={TrendingUp} label="Votes This Month" value="51,200" sub="+18% vs last month" />
        <StatCard icon={Award} label="Leading Contestant" value="Ishimwe Kevin" />
        <StatCard icon={Calendar} label="Last Vote" value="2 min ago" />
      </div>

      <DataTable
        columns={[
          { key: 'date', label: 'Date & Time' },
          { key: 'contestant', label: 'Contestant' },
          { key: 'category', label: 'Category' },
          { key: 'votes', label: 'Votes' },
          { key: 'channel', label: 'Channel' },
        ]}
        rows={VOTES}
      />
    </div>
  );
}
