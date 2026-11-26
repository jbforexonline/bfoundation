import { Vote, Award, Calendar } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import Notice from '../../components/ui/Notice';
import useApi from '../../hooks/useApi';
import { formatDate } from '../../api/client';
import '../../components/dashboard/DashboardPage.scss';

const SOURCE_LABEL = { FREE: 'Free vote', PURCHASE: 'Paid', BALANCE: 'Vote balance' };

export default function FanVoteHistoryPage() {
  const { data, error, loading } = useApi('/votes/history', { limit: 100 });
  const summary = data?.summary;
  const rows = (data?.votes ?? []).map((v) => ({
    id: v.id,
    date: formatDate(v.createdAt),
    contestant: v.contestant?.name ?? '—',
    category: v.category.name,
    votesUsed: v.votesUsed,
    type: SOURCE_LABEL[v.source] ?? v.source,
    status: 'Counted',
  }));

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Vote History</h1>
          <p className="dash-page__subtitle">Every vote you have cast so far.</p>
        </div>
      </div>

      <Notice tone="error">{error?.message}</Notice>

      <div className="dash-page__stats">
        <StatCard icon={Vote} label="Total Votes Cast" value={summary?.totalVotesCast ?? '—'} />
        <StatCard icon={Award} label="Categories Voted In" value={summary?.categoriesVotedIn ?? '—'} />
        <StatCard icon={Calendar} label="Last Vote" value={summary?.lastVoteAt ? formatDate(summary.lastVoteAt, { month: 'short', day: 'numeric' }) : '—'} />
      </div>

      <DataTable
        emptyLabel={loading ? 'Loading…' : 'No votes yet. Go to the Vote page to cast your free vote in each category.'}
        columns={[
          { key: 'date', label: 'Date' },
          { key: 'contestant', label: 'Contestant' },
          { key: 'category', label: 'Category' },
          { key: 'votesUsed', label: 'Votes Used' },
          { key: 'type', label: 'Type' },
          { key: 'status', label: 'Status', render: (row) => <Badge tone="success">{row.status}</Badge> },
        ]}
        rows={rows}
      />
    </div>
  );
}
