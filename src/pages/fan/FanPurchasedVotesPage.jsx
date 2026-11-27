import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, ShoppingCart, TrendingUp, Plus, RefreshCw } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import Notice from '../../components/ui/Notice';
import useApi from '../../hooks/useApi';
import { api, formatDateTime, formatRwf, titleCase } from '../../api/client';
import '../../components/dashboard/DashboardPage.scss';

const TONE = { PAID: 'success', PENDING: 'warning', FAILED: 'danger', CANCELLED: 'neutral' };

export default function FanPurchasedVotesPage() {
  const { data, error, loading, reload } = useApi('/votes/purchases', { limit: 50 });
  const [notice, setNotice] = useState(null);
  const summary = data?.summary;

  // A payment still "pending": ask the backend (which asks Paypack) for the latest status.
  const recheck = async (purchase) => {
    setNotice(null);
    try {
      const { payments } = await api('/payments', { query: { limit: 50 } });
      const payment = payments.find((p) => p.referenceId === purchase.id);
      if (!payment) throw new Error('No payment found for this purchase.');
      const d = await api(`/payments/${payment.id}/check`, { method: 'POST' });
      setNotice({ tone: d.payment.status === 'SUCCESSFUL' ? 'success' : 'info', text: `Payment is ${d.payment.status.toLowerCase()}.` });
      reload();
    } catch (err) {
      setNotice({ tone: 'error', text: err.message });
    }
  };

  const rows = (data?.purchases ?? []).map((p) => ({ id: p.id, raw: p }));

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Purchased Votes</h1>
          <p className="dash-page__subtitle">Your vote package purchases and your remaining vote balance.</p>
        </div>
        <Link to="/dashboard/fan/vote" state={{ contestant: null }} className="btn btn--gold">
          <Plus size={16} /> Buy votes
        </Link>
      </div>

      <Notice tone={notice?.tone}>{notice?.text}</Notice>
      <Notice tone="error">{error?.message}</Notice>

      <div className="dash-page__stats">
        <StatCard icon={Wallet} label="Votes Balance" value={summary?.voteBalance ?? '—'} sub="Bonus + purchased votes to use on the Vote page" />
        <StatCard icon={ShoppingCart} label="Packages Bought" value={summary?.packagesBought ?? '—'} sub={summary ? `${summary.votesBought} votes in total` : undefined} />
        <StatCard icon={TrendingUp} label="Total Spent" value={summary ? formatRwf(summary.totalSpent).replace('Free', '0 RWF') : '—'} />
      </div>

      <DataTable
        searchable={false}
        emptyLabel={loading ? 'Loading…' : 'No purchases yet.'}
        columns={[
          { key: 'date', label: 'Date', render: (row) => formatDateTime(row.raw.createdAt) },
          { key: 'package', label: 'Package', render: (row) => row.raw.package.label },
          { key: 'for', label: 'For', render: (row) => row.raw.contestant?.name ?? 'My balance' },
          { key: 'amount', label: 'Amount', render: (row) => formatRwf(row.raw.amount) },
          {
            key: 'status',
            label: 'Status',
            render: (row) => (
              <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Badge tone={TONE[row.raw.status]}>{titleCase(row.raw.status)}</Badge>
                {row.raw.status === 'PENDING' && (
                  <button type="button" className="btn btn--outline" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => recheck(row.raw)}>
                    <RefreshCw size={12} /> Check
                  </button>
                )}
              </span>
            ),
          },
        ]}
        rows={rows}
      />
    </div>
  );
}
