import { Users, MapPin, PieChart } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import ChartCard from '../../components/ui/ChartCard';
import Notice from '../../components/ui/Notice';
import useApi from '../../hooks/useApi';
import '../../components/dashboard/DashboardPage.scss';

// Only the parts of the chart that have people in them (keeps "Not specified" if that's all there is).
const nonEmpty = ({ labels, percent }) => {
  const pairs = labels.map((l, i) => [l, percent[i]]).filter(([, p]) => p > 0);
  return pairs.length ? { labels: pairs.map((p) => p[0]), data: pairs.map((p) => p[1]) } : { labels: ['No data yet'], data: [100] };
};

export default function ContestantDemographicsPage() {
  const { data: d, error } = useApi('/contestants/me/analytics/demographics');

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Demographics</h1>
          <p className="dash-page__subtitle">
            Who your supporters are, in percentages. Based on the optional details fans add to their profile.
          </p>
        </div>
      </div>

      <Notice tone="error">{error?.message}</Notice>
      {!d && !error && <p style={{ color: '#a8a49b' }}>Loading…</p>}

      {d && (
        <>
          <div className="dash-page__stats">
            <StatCard icon={Users} label="Supporters" value={d.supporters} sub={`${d.profilesCompletePercent}% shared their details`} />
            <StatCard icon={PieChart} label="Largest Age Group" value={d.largestAgeGroup?.label ?? '—'} sub={d.largestAgeGroup ? `${d.largestAgeGroup.percent}% of supporters` : 'Not enough data yet'} />
            <StatCard icon={MapPin} label="Top Location" value={d.topLocation?.label ?? '—'} sub={d.topLocation ? `${d.topLocation.percent}% of supporters` : 'Not enough data yet'} />
          </div>

          <div className="dash-page__card-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <ChartCard title="Age Range (%)" type="doughnut" {...nonEmpty(d.age)} label="% of supporters" />
            <ChartCard title="Gender (%)" type="doughnut" {...nonEmpty(d.gender)} label="% of supporters" />
          </div>
          <div className="dash-page__card-grid" style={{ gridTemplateColumns: '1fr' }}>
            <ChartCard title="Location (%)" type="doughnut" {...nonEmpty(d.location)} label="% of supporters" />
          </div>
        </>
      )}
    </div>
  );
}
