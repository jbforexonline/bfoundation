import { Users, Heart, Repeat, Crown } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import Notice from '../../components/ui/Notice';
import useApi from '../../hooks/useApi';
import { timeAgo } from '../../api/client';
import '../../components/dashboard/DashboardPage.scss';

export default function ContestantSupportersPage() {
  const { data: d, error } = useApi('/contestants/me/analytics/supporters');

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Supporters</h1>
          <p className="dash-page__subtitle">Who&rsquo;s voting for you, and how often they come back.</p>
        </div>
      </div>

      <Notice tone="error">{error?.message}</Notice>
      {!d && !error && <p style={{ color: '#a8a49b' }}>Loading…</p>}

      {d && (
        <>
          <div className="dash-page__stats" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            <StatCard icon={Users} label="Supporters" value={d.supporters} sub="people who voted for you" />
            <StatCard icon={Heart} label="Followers" value={d.followers} sub="have you in their favorites" />
            <StatCard icon={Repeat} label="Repeat Voters" value={`${d.repeatVoterPercent}%`} sub="voted more than once" />
            <StatCard icon={Crown} label="Top Supporter" value={d.topSupporter?.name ?? '—'} sub={d.topSupporter ? `${d.topSupporter.sharePercent}% of your votes` : undefined} />
          </div>

          <div>
            <h2 className="dash-page__section-title">Top supporters</h2>
            <DataTable
              emptyLabel="No supporters yet — share your voting link!"
              columns={[
                { key: 'name', label: 'Name' },
                { key: 'sharePercent', label: 'Share of your votes', render: (row) => `${row.sharePercent}%` },
                { key: 'lastActive', label: 'Last vote', render: (row) => timeAgo(row.lastActive) },
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
              rows={d.top.map((r, i) => ({ id: i, ...r }))}
            />
          </div>
        </>
      )}
    </div>
  );
}
