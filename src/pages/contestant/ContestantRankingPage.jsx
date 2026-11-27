import { Trophy, ArrowUp, ArrowDown, CalendarClock } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import Notice from '../../components/ui/Notice';
import useApi from '../../hooks/useApi';
import { initialsOf } from '../../api/client';
import '../../components/dashboard/DashboardPage.scss';

export default function ContestantRankingPage() {
  const { data: d, error } = useApi('/contestants/me/analytics/ranking');

  const position = d?.position;
  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Ranking</h1>
          <p className="dash-page__subtitle">Your standing in {d?.category.name ?? 'your category'}. Everyone sees levels, not vote numbers.</p>
        </div>
      </div>

      <Notice tone="error">{error?.message}</Notice>
      {!d && !error && <p style={{ color: '#a8a49b' }}>Loading…</p>}

      {d && (
        <>
          <div className="dash-page__stats">
            <StatCard icon={Trophy} label="Current Rank" value={`#${d.rank}`} sub={`of ${d.total} in ${d.category.name}`} />
            {position?.type === 'lead' ? (
              <StatCard icon={ArrowUp} label="Your Lead over #2" value={`${position.percent}%`} sub="of your votes" />
            ) : position ? (
              <StatCard icon={ArrowDown} label="Behind the Leader" value={`${position.percent}%`} sub="of the leader's votes" />
            ) : (
              <StatCard icon={ArrowUp} label="Competition" value="Just you" sub="No one else in this category yet" />
            )}
            <StatCard icon={CalendarClock} label="Days Left" value={d.daysLeft ?? '—'} sub={d.daysLeft === null ? 'No end date set' : 'until voting closes'} />
          </div>

          <div>
            <h2 className="dash-page__section-title">Category leaderboard</h2>
            <DataTable
              searchable={false}
              columns={[
                { key: 'rank', label: '#' },
                {
                  key: 'name',
                  label: 'Contestant',
                  render: (row) => (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: row.isYou ? 700 : 400 }}>
                      <span style={{ width: 30, height: 30, borderRadius: '50%', background: '#2a2620', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', fontSize: '0.68rem', color: '#f0a93a', flexShrink: 0 }}>
                        {row.profileImage ? <img src={row.profileImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initialsOf(row.name)}
                      </span>
                      {row.name}
                    </span>
                  ),
                },
                { key: 'level', label: 'Level', render: (row) => row.level.label },
                { key: 'you', label: '', render: (row) => (row.isYou ? <Badge tone="gold">You</Badge> : null) },
              ]}
              rows={d.leaderboard}
            />
          </div>
        </>
      )}
    </div>
  );
}
