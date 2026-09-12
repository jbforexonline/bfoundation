import StatCard from '../../components/ui/StatCard';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import { Wallet, ShoppingCart, TrendingUp } from 'lucide-react';
import '../../components/dashboard/DashboardPage.scss';

const PURCHASES = [
  { id: 1, date: '2026-08-20', package: '50 Votes Pack', amount: '4,000 RWF', status: 'Paid' },
  { id: 2, date: '2026-08-10', package: '10 Votes Pack', amount: '1,000 RWF', status: 'Paid' },
  { id: 3, date: '2026-07-29', package: '100 Votes Pack', amount: '7,000 RWF', status: 'Paid' },
];

export default function FanPurchasedVotesPage() {
  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Purchased Votes</h1>
          <p className="dash-page__subtitle">Your vote package purchase history and remaining balance.</p>
        </div>
      </div>

      <div className="dash-page__stats">
        <StatCard icon={Wallet} label="Votes Balance" value="35" sub="Available to use" />
        <StatCard icon={ShoppingCart} label="Packages Bought" value="3" />
        <StatCard icon={TrendingUp} label="Total Spent" value="12,000 RWF" />
      </div>

      <DataTable
        columns={[
          { key: 'date', label: 'Date' },
          { key: 'package', label: 'Package' },
          { key: 'amount', label: 'Amount' },
          { key: 'status', label: 'Status', render: (row) => <Badge tone="success">{row.status}</Badge> },
        ]}
        rows={PURCHASES}
      />
    </div>
  );
}
