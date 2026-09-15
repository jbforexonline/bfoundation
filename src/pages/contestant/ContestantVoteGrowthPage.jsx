import { TrendingUp, ArrowUpRight, Flame } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import ChartCard from '../../components/ui/ChartCard';
import '../../components/dashboard/DashboardPage.scss';

const WEEK_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const WEEK_DATA = [980, 1240, 1100, 1560, 2010, 2680, 2340];

export default function ContestantVoteGrowthPage() {
  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Vote Growth</h1>
          <p className="dash-page__subtitle">How fast your vote count is climbing.</p>
        </div>
      </div>

      <div className="dash-page__stats">
        <StatCard icon={TrendingUp} label="Weekly Growth" value="+12%" sub="vs previous week" />
        <StatCard icon={ArrowUpRight} label="Best Day" value="Saturday" sub="2,680 votes" />
        <StatCard icon={Flame} label="Current Streak" value="9 days" sub="of daily growth" />
      </div>

      <ChartCard
        title="Votes This Week"
        sub="Mon – Sun"
        type="line"
        labels={WEEK_LABELS}
        data={WEEK_DATA}
        label="Votes"
        color="#3ec95f"
      />
    </div>
  );
}
