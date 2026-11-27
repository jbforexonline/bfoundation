import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Vote, Wallet, Users, TrendingUp, Eye, MousePointerClick, ClipboardList, Megaphone, Inbox } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import ChartCard from '../../components/ui/ChartCard';
import DataTable from '../../components/ui/DataTable';
import Notice from '../../components/ui/Notice';
import useApi from '../../hooks/useApi';
import { formatNumber, formatRwf } from '../../api/client';
import '../../components/dashboard/DashboardPage.scss';

const vsLastMonth = (p) => (p === undefined ? undefined : `${p > 0 ? '+' : ''}${p}% vs last month`);

// Platform-wide real numbers (admins and moderators only).
export default function AdminAnalyticsPage() {
  const { data, error } = useApi('/admin/analytics/overview');
  const [days, setDays] = useState(30);
  const traffic = useApi('/admin/analytics/traffic', { days });
  const t = data?.totals;
  const c = data?.charts;
  const todo = data?.todo;

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Analytics</h1>
          <p className="dash-page__subtitle">Platform-wide performance at a glance (real numbers, admins only).</p>
        </div>
      </div>

      <Notice tone="error">{error?.message || traffic.error?.message}</Notice>

      {todo && (todo.pendingApplications > 0 || todo.nominationsToReview > 0 || todo.newContactMessages > 0) && (
        <div className="dash-page__list" style={{ marginBottom: 20 }}>
          {todo.pendingApplications > 0 && (
            <Link to="/dashboard/admin/applications" className="dash-item" style={{ textDecoration: 'none' }}>
              <div className="dash-item__icon"><ClipboardList size={18} /></div>
              <div className="dash-item__body"><p className="dash-item__title">{todo.pendingApplications} application(s) waiting for review</p></div>
            </Link>
          )}
          {todo.nominationsToReview > 0 && (
            <Link to="/dashboard/admin/nominations" className="dash-item" style={{ textDecoration: 'none' }}>
              <div className="dash-item__icon"><Megaphone size={18} /></div>
              <div className="dash-item__body"><p className="dash-item__title">{todo.nominationsToReview} nomination(s) ready for review</p></div>
            </Link>
          )}
          {todo.newContactMessages > 0 && (
            <Link to="/dashboard/admin/inbox" className="dash-item" style={{ textDecoration: 'none' }}>
              <div className="dash-item__icon"><Inbox size={18} /></div>
              <div className="dash-item__body"><p className="dash-item__title">{todo.newContactMessages} new contact message(s)</p></div>
            </Link>
          )}
        </div>
      )}

      <div className="dash-page__stats" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <StatCard icon={Vote} label="Total Votes (All Time)" value={t ? formatNumber(t.votes) : '—'} sub={t ? `${formatNumber(t.votesThisMonth)} this month · ${vsLastMonth(t.votesChangePercent)}` : undefined} />
        <StatCard icon={Wallet} label="Revenue (All Time)" value={t ? formatRwf(t.revenueRwf).replace('Free', '0 RWF') : '—'} sub={t ? vsLastMonth(t.revenueChangePercent) : undefined} />
        <StatCard icon={Users} label="Members" value={t ? formatNumber(t.users.total) : '—'} sub={t ? `${formatNumber(t.users.fans)} fans · ${t.newUsersThisMonth} new this month` : undefined} />
        <StatCard icon={TrendingUp} label="Avg. Votes / Contestant" value={t ? formatNumber(t.avgVotesPerContestant) : '—'} sub={t ? `${t.activeContestants} active contestants` : undefined} />
      </div>

      {c && (
        <>
          <div className="dash-page__card-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <ChartCard title="Votes Over Time" sub="Last 6 months" type="line" labels={c.votesByMonth.labels} data={c.votesByMonth.data} label="Votes" />
            <ChartCard title="Votes by Category" sub="All time" type="bar" labels={c.votesByCategory.labels} data={c.votesByCategory.data} label="Votes" color="#3ec95f" />
          </div>
          <div className="dash-page__card-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <ChartCard title="Revenue Over Time" sub="RWF, last 6 months (successful payments)" type="line" labels={c.revenueByMonth.labels} data={c.revenueByMonth.data} label="Revenue (RWF)" />
            <ChartCard title="New Accounts" sub="Last 6 months" type="bar" labels={c.signupsByMonth.labels} data={c.signupsByMonth.data} label="Sign-ups" color="#5b8def" />
          </div>
        </>
      )}

      <div className="dash-page__header" style={{ marginTop: 12 }}>
        <div>
          <h2 className="dash-page__section-title" style={{ margin: 0 }}>Website traffic</h2>
          <p className="dash-page__subtitle">Page views on the website (no personal data is stored).</p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[7, 30, 90].map((d) => (
            <button key={d} type="button" className={`btn ${days === d ? 'btn--gold' : 'btn--outline'}`} style={{ padding: '6px 12px', fontSize: '0.78rem' }} onClick={() => setDays(d)}>
              {d} days
            </button>
          ))}
        </div>
      </div>
      {traffic.data && (
        <>
          <div className="dash-page__stats">
            <StatCard icon={Eye} label="Page Views" value={formatNumber(traffic.data.pageViews)} sub={`Last ${traffic.data.days} days`} />
            <StatCard icon={Users} label="Visitors" value={formatNumber(traffic.data.visitors)} sub="Browser sessions" />
            <StatCard icon={MousePointerClick} label="Last 24 hours" value={formatNumber(traffic.data.last24hViews)} sub="Page views" />
          </div>
          <div className="dash-page__card-grid" style={{ gridTemplateColumns: '1.6fr 1fr', alignItems: 'start' }}>
            <ChartCard title="Page Views per Day" sub={`Last ${traffic.data.days} days`} type="bar" labels={traffic.data.byDay.labels} data={traffic.data.byDay.views} label="Page views" color="#5b8def" />
            <div>
              <h3 className="dash-page__section-title">Top pages</h3>
              <DataTable
                searchable={false}
                emptyLabel="No visits yet."
                columns={[
                  { key: 'path', label: 'Page' },
                  { key: 'views', label: 'Views', render: (row) => formatNumber(row.views) },
                ]}
                rows={traffic.data.topPages.map((p) => ({ id: p.path, ...p }))}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
