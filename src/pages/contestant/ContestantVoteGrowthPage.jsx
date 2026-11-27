import { TrendingUp, ArrowUpRight, Flame } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import ChartCard from '../../components/ui/ChartCard';
import Notice from '../../components/ui/Notice';
import useApi from '../../hooks/useApi';
import '../../components/dashboard/DashboardPage.scss';

export default function ContestantVoteGrowthPage() {
  const { data: d, error } = useApi('/contestants/me/analytics/growth');

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Vote Growth</h1>
          <p className="dash-page__subtitle">How fast your support is climbing.</p>
        </div>
      </div>

      <Notice tone="error">{error?.message}</Notice>
      {!d && !error && <p style={{ color: '#a8a49b' }}>Loading…</p>}

      {d && (
        <>
          <div className="dash-page__stats">
            <StatCard icon={TrendingUp} label="Weekly Growth" value={`${d.weeklyGrowthPercent > 0 ? '+' : ''}${d.weeklyGrowthPercent}%`} sub="vs previous week" />
            <StatCard icon={ArrowUpRight} label="Best Day" value={d.bestDay?.day ?? '—'} sub={d.bestDay ? `${d.bestDay.sharePercent}% of this week's votes` : 'No votes this week yet'} />
            <StatCard icon={Flame} label="Current Streak" value={`${d.streakDays} day${d.streakDays === 1 ? '' : 's'}`} sub="in a row with new votes" />
          </div>

          <ChartCard
            title="Votes This Week"
            sub="Each day's share of the last 7 days (%)"
            type="bar"
            labels={d.chart.labels}
            data={d.chart.sharePercent}
            label="% of the week"
            color="#3ec95f"
          />
        </>
      )}
    </div>
  );
}
