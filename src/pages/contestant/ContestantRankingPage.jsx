import { Trophy, ArrowUp } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import '../../components/dashboard/DashboardPage.scss';

const LEADERBOARD = [
  { id: 1, rank: 1, name: 'Malaika Uwase (You)', votes: 18420, isYou: true },
  { id: 2, rank: 2, name: 'Bruce Karenzi', votes: 15310 },
  { id: 3, rank: 3, name: 'Diane Iradukunda', votes: 12980 },
  { id: 4, rank: 4, name: 'Samuel Bizimana', votes: 9860 },
  { id: 5, rank: 5, name: 'Christelle Uwase', votes: 8210 },
];

export default function ContestantRankingPage() {
  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Ranking</h1>
          <p className="dash-page__subtitle">Your standing in Best Musician this cycle.</p>
        </div>
      </div>

      <div className="dash-page__stats">
        <StatCard icon={Trophy} label="Current Rank" value="#1" sub="Best Musician" />
        <StatCard icon={ArrowUp} label="Lead Over #2" value="3,110 votes" />
        <StatCard icon={Trophy} label="Days Left to Hold Rank" value="14" />
      </div>

      <div>
        <h2 className="dash-page__section-title">Category leaderboard</h2>
        <DataTable
          searchable={false}
          columns={[
            { key: 'rank', label: '#' },
            { key: 'name', label: 'Contestant' },
            { key: 'votes', label: 'Votes', render: (row) => row.votes.toLocaleString() },
            {
              key: 'status',
              label: '',
              render: (row) => (row.isYou ? <Badge tone="gold">You</Badge> : null),
            },
          ]}
          rows={LEADERBOARD}
        />
      </div>
    </div>
  );
}
