import { Wallet, CheckCircle2, XCircle, Clock3 } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import '../../components/dashboard/DashboardPage.scss';

const PAYMENTS = [
  { id: 'TXN-90231', user: 'Joyce Uwase', amount: '4,000 RWF', method: 'MTN MoMo', status: 'Paid' },
  { id: 'TXN-90230', user: 'Eric Niyonzima', amount: '1,000 RWF', method: 'Airtel Money', status: 'Paid' },
  { id: 'TXN-90229', user: 'Aline Mutesi', amount: '7,000 RWF', method: 'Visa Card', status: 'Paid' },
  { id: 'TXN-90228', user: 'Patrick Habimana', amount: '4,000 RWF', method: 'MTN MoMo', status: 'Pending' },
  { id: 'TXN-90227', user: 'Christelle Uwase', amount: '1,000 RWF', method: 'Airtel Money', status: 'Failed' },
  { id: 'TXN-90226', user: 'Samuel Bizimana', amount: '7,000 RWF', method: 'MTN MoMo', status: 'Paid' },
];

const TONE = { Paid: 'success', Pending: 'warning', Failed: 'danger' };

export default function AdminPaymentsPage() {
  const paidCount = PAYMENTS.filter((p) => p.status === 'Paid').length;
  const failedCount = PAYMENTS.filter((p) => p.status === 'Failed').length;

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Payments</h1>
          <p className="dash-page__subtitle">Vote package purchases and their transaction status.</p>
        </div>
      </div>

      <div className="dash-page__stats">
        <StatCard icon={Wallet} label="Total Revenue" value="86.4M RWF" sub="All time" />
        <StatCard icon={CheckCircle2} label="Successful" value={paidCount} />
        <StatCard icon={XCircle} label="Failed" value={failedCount} />
      </div>

      <DataTable
        columns={[
          { key: 'id', label: 'Transaction ID' },
          { key: 'user', label: 'User' },
          { key: 'amount', label: 'Amount' },
          { key: 'method', label: 'Method' },
          {
            key: 'status',
            label: 'Status',
            render: (row) => (
              <Badge tone={TONE[row.status] ?? 'neutral'}>
                {row.status === 'Pending' && <Clock3 size={11} style={{ marginRight: 4, verticalAlign: -1 }} />}
                {row.status}
              </Badge>
            ),
          },
        ]}
        rows={PAYMENTS}
      />
    </div>
  );
}
