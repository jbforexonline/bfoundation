import { Vote, Calendar, TrendingUp, Users } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import ChartCard from '../../components/ui/ChartCard';
import '../../components/dashboard/DashboardPage.scss';

const LABELS = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
const DATA = [1200, 3400, 6800, 10200, 14600, 18420];

export default function ContestantVoteOverviewPage() {
  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Vote Overview</h1>
          <p className="dash-page__subtitle">Your total votes at a glance.</p>
        </div>
      </div>

      <div className="dash-page__stats" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <StatCard icon={Vote} label="Total Votes" value="18,420" />
        <StatCard icon={Calendar} label="Votes Today" value="340" />
        <StatCard icon={TrendingUp} label="Votes This Week" value="2,680" sub="+12% vs last week" />
        <StatCard icon={Users} label="Unique Supporters" value="6,140" />
      </div>

      <ChartCard
        title="Cumulative Votes"
        sub="Since campaign start"
        type="line"
        labels={LABELS}
        data={DATA}
        label="Total votes"
      />
    </div>
  );
}
