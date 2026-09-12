import { Vote, Wallet, Users, TrendingUp } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import ChartCard from '../../components/ui/ChartCard';
import '../../components/dashboard/DashboardPage.scss';

const VOTE_TREND_LABELS = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
const VOTE_TREND_DATA = [12000, 18500, 24200, 31000, 42500, 51200];

const CATEGORY_LABELS = ['Musician', 'Footballer', 'Influencer', 'Comedian', 'TikToker', 'DJ'];
const CATEGORY_DATA = [18420, 21040, 13500, 9640, 10420, 6210];

const REVENUE_LABELS = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
const REVENUE_DATA = [3.1, 4.8, 6.2, 8.4, 11.6, 14.2];

export default function AdminAnalyticsPage() {
  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Analytics</h1>
          <p className="dash-page__subtitle">Platform-wide performance at a glance.</p>
        </div>
      </div>

      <div className="dash-page__stats" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <StatCard icon={Vote} label="Total Votes (All Time)" value="1.2M" sub="+18% vs last month" />
        <StatCard icon={Wallet} label="Revenue (All Time)" value="86.4M RWF" sub="+9% vs last month" />
        <StatCard icon={Users} label="Active Contestants" value="1,250+" />
        <StatCard icon={TrendingUp} label="Avg. Votes / Contestant" value="960" />
      </div>

      <div className="dash-page__card-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <ChartCard
          title="Votes Over Time"
          sub="Last 6 months"
          type="line"
          labels={VOTE_TREND_LABELS}
          data={VOTE_TREND_DATA}
          label="Votes"
        />
        <ChartCard
          title="Votes by Category"
          sub="Current cycle"
          type="bar"
          labels={CATEGORY_LABELS}
          data={CATEGORY_DATA}
          label="Votes"
          color="#3ec95f"
        />
      </div>

      <div className="dash-page__card-grid" style={{ gridTemplateColumns: '1fr' }}>
        <ChartCard
          title="Revenue Over Time"
          sub="Millions of RWF, last 6 months"
          type="line"
          labels={REVENUE_LABELS}
          data={REVENUE_DATA}
          label="Revenue (M RWF)"
        />
      </div>
    </div>
  );
}
