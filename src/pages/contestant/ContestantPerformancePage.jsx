import { Gauge, Percent, Clock3 } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import ChartCard from '../../components/ui/ChartCard';
import '../../components/dashboard/DashboardPage.scss';

const SOURCE_LABELS = ['Mobile Money', 'Card', 'Referral Link', 'Direct'];
const SOURCE_DATA = [9200, 4300, 3100, 1820];

export default function ContestantPerformancePage() {
  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Performance</h1>
          <p className="dash-page__subtitle">Where your votes are coming from and how efficiently they convert.</p>
        </div>
      </div>

      <div className="dash-page__stats">
        <StatCard icon={Gauge} label="Votes / Supporter" value="3.0" sub="average" />
        <StatCard icon={Percent} label="Link Click → Vote" value="38%" sub="referral conversion" />
        <StatCard icon={Clock3} label="Peak Voting Hour" value="8–9 PM" />
      </div>

      <ChartCard
        title="Votes by Source"
        sub="Current cycle"
        type="bar"
        labels={SOURCE_LABELS}
        data={SOURCE_DATA}
        label="Votes"
        color="#5b8def"
      />
    </div>
  );
}
