import { Users, MapPin } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import ChartCard from '../../components/ui/ChartCard';
import '../../components/dashboard/DashboardPage.scss';

const AGE_LABELS = ['13–17', '18–24', '25–34', '35–44', '45+'];
const AGE_DATA = [420, 2860, 2100, 560, 200];

const GENDER_LABELS = ['Women', 'Men', 'Not specified'];
const GENDER_DATA = [3680, 2240, 220];

const LOCATION_LABELS = ['Kigali', 'Southern Province', 'Northern Province', 'Western Province', 'Eastern Province'];
const LOCATION_DATA = [3100, 980, 720, 650, 690];

export default function ContestantDemographicsPage() {
  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Demographics</h1>
          <p className="dash-page__subtitle">Who your supporters are, at a glance.</p>
        </div>
      </div>

      <div className="dash-page__stats">
        <StatCard icon={Users} label="Total Supporters" value="6,140" />
        <StatCard icon={Users} label="Largest Age Group" value="18–24" sub="46% of supporters" />
        <StatCard icon={MapPin} label="Top Location" value="Kigali" sub="50% of supporters" />
      </div>

      <div className="dash-page__card-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <ChartCard title="Age Range" type="doughnut" labels={AGE_LABELS} data={AGE_DATA} label="Supporters" />
        <ChartCard title="Gender" type="doughnut" labels={GENDER_LABELS} data={GENDER_DATA} label="Supporters" />
      </div>

      <div className="dash-page__card-grid" style={{ gridTemplateColumns: '1fr' }}>
        <ChartCard title="Location" type="doughnut" labels={LOCATION_LABELS} data={LOCATION_DATA} label="Supporters" />
      </div>
    </div>
  );
}
