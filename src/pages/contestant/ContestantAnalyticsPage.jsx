import { Vote, Trophy, TrendingUp, Users } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import ChartCard from '../../components/ui/ChartCard';
import '../../components/dashboard/DashboardPage.scss';

const VOTE_TREND_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const VOTE_TREND_DATA = [980, 1240, 1100, 1560, 2010, 2680, 2340];

const SOURCE_LABELS = ['Mobile Money', 'Card', 'Referral Link', 'Direct'];
const SOURCE_DATA = [9200, 4300, 3100, 1820];

export default function ContestantAnalyticsPage() {
  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Analytics</h1>
          <p className="dash-page__subtitle">How your campaign is performing this cycle.</p>
        </div>
      </div>

      <div className="dash-page__stats" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <StatCard icon={Vote} label="Total Votes" value="18,420" sub="+12% this week" />
        <StatCard icon={Trophy} label="Category Rank" value="#1" sub="Best Musician" />
        <StatCard icon={Users} label="Unique Supporters" value="6,140" />
        <StatCard icon={TrendingUp} label="Votes / Supporter" value="3.0" sub="avg." />
      </div>

      <div className="dash-page__card-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <ChartCard
          title="Votes This Week"
          sub="Mon – Sun"
          type="line"
          labels={VOTE_TREND_LABELS}
          data={VOTE_TREND_DATA}
          label="Votes"
        />
        <ChartCard
          title="Votes by Source"
          sub="Current cycle"
          type="bar"
          labels={SOURCE_LABELS}
          data={SOURCE_DATA}
          label="Votes"
          color="#3ec95f"
        />
      </div>
    </div>
  );
}
