import { Award, Trophy, TrendingUp, Users } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import ChartCard from '../../components/ui/ChartCard';
import Notice from '../../components/ui/Notice';
import useApi from '../../hooks/useApi';
import '../../components/dashboard/DashboardPage.scss';

const signed = (p) => `${p > 0 ? '+' : ''}${p}%`;

// Contestants see their level, rank and trends — never the exact number of votes (admins only).
export default function ContestantVoteOverviewPage() {
  const { data: d, error } = useApi('/contestants/me/analytics/overview');

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Vote Overview</h1>
          <p className="dash-page__subtitle">Your level, your position and how your support is growing. Exact vote numbers are kept private.</p>
        </div>
      </div>

      <Notice tone="error">{error?.message}</Notice>
      {!d && !error && <p style={{ color: '#a8a49b' }}>Loading…</p>}

      {d && (
        <>
          <div className="dash-page__stats" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            <StatCard icon={Award} label="Your Level" value={d.level.label} sub={d.nextLevel ? `${d.nextLevel.progressPercent}% of the way to ${d.nextLevel.label}` : 'Highest level reached!'} />
            <StatCard icon={Trophy} label="Rank" value={`#${d.rank}`} sub={`of ${d.contestantsInCategory} in ${d.category.name}`} />
            <StatCard icon={TrendingUp} label="This Week" value={signed(d.weekChangePercent)} sub="vs the week before" />
            <StatCard icon={Users} label="Supporters" value={d.supporters} sub="people who voted for you" />
          </div>

          {d.nextLevel && (
            <div style={{ margin: '4px 0 24px' }}>
              <p style={{ fontSize: '0.85rem', color: '#a8a49b', marginBottom: 6 }}>
                Progress to <strong style={{ color: '#f0a93a' }}>{d.nextLevel.label}</strong>
              </p>
              <div style={{ height: 10, background: '#2a2620', borderRadius: 6 }}>
                <div style={{ width: `${d.nextLevel.progressPercent}%`, height: '100%', background: 'linear-gradient(90deg,#f0a93a,#3ec95f)', borderRadius: 6 }} />
              </div>
            </div>
          )}

          <ChartCard
            title="Your Growth"
            sub="Share of your current support reached by the end of each month (%)"
            type="line"
            labels={d.chart.labels}
            data={d.chart.cumulativePercent}
            label="% of today"
          />
        </>
      )}
    </div>
  );
}
