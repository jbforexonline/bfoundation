import { Gauge, Percent, Clock3 } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import ChartCard from '../../components/ui/ChartCard';
import Notice from '../../components/ui/Notice';
import useApi from '../../hooks/useApi';
import '../../components/dashboard/DashboardPage.scss';

export default function ContestantPerformancePage() {
  const { data: d, error } = useApi('/contestants/me/analytics/performance');

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Performance</h1>
          <p className="dash-page__subtitle">Where your votes come from and how well your link converts.</p>
        </div>
      </div>

      <Notice tone="error">{error?.message}</Notice>
      {!d && !error && <p style={{ color: '#a8a49b' }}>Loading…</p>}

      {d && (
        <>
          <div className="dash-page__stats">
            <StatCard icon={Gauge} label="Votes / Supporter" value={d.votesPerSupporter} sub="average" />
            <StatCard icon={Percent} label="Link Click → Vote" value={`${d.clickToVotePercent}%`} sub="visitors of your link who voted" />
            <StatCard icon={Clock3} label="Peak Voting Hour" value={d.peakHour ?? '—'} sub="Kigali time" />
          </div>

          <ChartCard
            title="Votes by Source"
            sub="% of your votes (a vote through your link is also free or purchased)"
            type="bar"
            labels={d.sources.labels}
            data={d.sources.percent}
            label="% of votes"
            color="#5b8def"
          />
        </>
      )}
    </div>
  );
}
