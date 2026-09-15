import { Users, Heart, Repeat, Crown } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import '../../components/dashboard/DashboardPage.scss';

const SUPPORTERS = [
  { id: 1, name: 'Joyce Uwase', votes: 320, lastActive: '2 hours ago', tier: 'Top Supporter' },
  { id: 2, name: 'Eric Niyonzima', votes: 210, lastActive: '1 day ago', tier: 'Top Supporter' },
  { id: 3, name: 'Aline Mutesi', votes: 180, lastActive: '5 hours ago', tier: 'Regular' },
  { id: 4, name: 'Patrick Habimana', votes: 140, lastActive: '3 days ago', tier: 'Regular' },
  { id: 5, name: 'Christelle Uwase', votes: 95, lastActive: '6 hours ago', tier: 'Regular' },
  { id: 6, name: 'Samuel Bizimana', votes: 60, lastActive: '1 week ago', tier: 'New' },
];

export default function ContestantSupportersPage() {
  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Supporters</h1>
          <p className="dash-page__subtitle">Who's voting for you, and how often they come back.</p>
        </div>
      </div>

      <div className="dash-page__stats">
        <StatCard icon={Users} label="Unique Supporters" value="6,140" />
        <StatCard icon={Repeat} label="Repeat Voters" value="42%" sub="Voted more than once" />
        <StatCard icon={Crown} label="Top Supporter" value="Joyce U." sub="320 votes" />
      </div>

      <div>
        <h2 className="dash-page__section-title">Top supporters</h2>
        <DataTable
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'votes', label: 'Votes Given' },
            { key: 'lastActive', label: 'Last Active' },
            {
              key: 'tier',
              label: 'Tier',
              render: (row) => (
                <Badge tone={row.tier === 'Top Supporter' ? 'gold' : row.tier === 'New' ? 'neutral' : 'success'}>
                  {row.tier === 'Top Supporter' && <Heart size={11} style={{ marginRight: 4, verticalAlign: -1 }} fill="currentColor" />}
                  {row.tier}
                </Badge>
              ),
            },
          ]}
          rows={SUPPORTERS}
        />
      </div>
    </div>
  );
}
