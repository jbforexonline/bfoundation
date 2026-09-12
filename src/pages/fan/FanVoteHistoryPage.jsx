import StatCard from '../../components/ui/StatCard';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import { Vote, Award, Calendar } from 'lucide-react';
import '../../components/dashboard/DashboardPage.scss';

const HISTORY = [
  { id: 1, date: '2026-08-21', contestant: 'Malaika Uwase', category: 'Best Musician', votesUsed: 10, status: 'Counted' },
  { id: 2, date: '2026-08-18', contestant: 'Ishimwe Kevin', category: 'Best Footballer', votesUsed: 5, status: 'Counted' },
  { id: 3, date: '2026-08-12', contestant: 'Grace Umutoni', category: 'Best Influencer', votesUsed: 3, status: 'Counted' },
  { id: 4, date: '2026-08-05', contestant: 'Divine Ingabire', category: 'Best Comedian', votesUsed: 9, status: 'Counted' },
];

export default function FanVoteHistoryPage() {
  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Vote History</h1>
          <p className="dash-page__subtitle">Every vote you have cast so far.</p>
        </div>
      </div>

      <div className="dash-page__stats">
        <StatCard icon={Vote} label="Total Votes Cast" value="27" />
        <StatCard icon={Award} label="Categories Voted In" value="4" />
        <StatCard icon={Calendar} label="Last Vote" value="Aug 21" />
      </div>

      <DataTable
        columns={[
          { key: 'date', label: 'Date' },
          { key: 'contestant', label: 'Contestant' },
          { key: 'category', label: 'Category' },
          { key: 'votesUsed', label: 'Votes Used' },
          { key: 'status', label: 'Status', render: (row) => <Badge tone="success">{row.status}</Badge> },
        ]}
        rows={HISTORY}
      />
    </div>
  );
}
