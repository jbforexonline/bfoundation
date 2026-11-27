import { MessageCircle, Heart, Share2, Repeat, Users } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import DataTable from '../../components/ui/DataTable';
import Notice from '../../components/ui/Notice';
import useApi from '../../hooks/useApi';
import { formatNumber, timeAgo } from '../../api/client';
import '../../components/dashboard/DashboardPage.scss';

export default function ContestantEngagementPage() {
  const { data: d, error } = useApi('/contestants/me/analytics/engagement');

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Engagement</h1>
          <p className="dash-page__subtitle">How supporters are interacting with your campaign.</p>
        </div>
      </div>

      <Notice tone="error">{error?.message}</Notice>
      {!d && !error && <p style={{ color: '#a8a49b' }}>Loading…</p>}

      {d && (
        <>
          <div className="dash-page__stats" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
            <StatCard icon={Heart} label="Post Reactions" value={formatNumber(d.reactions)} />
            <StatCard icon={MessageCircle} label="Comments" value={formatNumber(d.comments)} sub={`${formatNumber(d.messages)} private messages`} />
            <StatCard icon={Share2} label="Link Shares" value={formatNumber(d.shares)} />
            <StatCard icon={Users} label="Followers" value={formatNumber(d.followers)} />
            <StatCard icon={Repeat} label="Repeat Voter Rate" value={`${d.repeatVoterPercent}%`} />
          </div>

          <div>
            <h2 className="dash-page__section-title">Recent activity</h2>
            <DataTable
              emptyLabel="No activity yet. Post an update to get the conversation going!"
              columns={[
                { key: 'name', label: 'Supporter' },
                { key: 'action', label: 'Action' },
                { key: 'detail', label: 'Detail' },
                { key: 'time', label: 'Time', render: (row) => timeAgo(row.at) },
              ]}
              rows={d.activity.map((a, i) => ({ id: i, ...a }))}
            />
          </div>
        </>
      )}
    </div>
  );
}
