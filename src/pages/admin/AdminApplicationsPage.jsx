import { useState } from 'react';
import { ClipboardList, Clock3, CheckCircle2, XCircle } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import '../../components/dashboard/DashboardPage.scss';

const INITIAL_APPLICATIONS = [
  { id: 1, applicant: 'Yves Mugenzi', category: 'Best Journalist', date: '2026-09-05', status: 'Pending' },
  { id: 2, applicant: 'Immaculee Nyirahabimana', category: 'Entrepreneur', date: '2026-09-04', status: 'Pending' },
  { id: 3, applicant: 'Placide Rukundo', category: 'Best Dancer', date: '2026-09-02', status: 'Approved' },
  { id: 4, applicant: 'Chantal Mukashyaka', category: 'Best Influencer', date: '2026-08-30', status: 'Pending' },
  { id: 5, applicant: 'Olivier Hakizimana', category: 'Best DJ', date: '2026-08-27', status: 'Rejected' },
  { id: 6, applicant: 'Beatrice Ingabire', category: 'Best Actor', date: '2026-08-24', status: 'Approved' },
];

const TONE = { Pending: 'warning', Approved: 'success', Rejected: 'danger' };

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState(INITIAL_APPLICATIONS);

  const decide = (id, status) => {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    // TODO: call your real "review application" endpoint here.
  };

  const pendingCount = applications.filter((a) => a.status === 'Pending').length;
  const approvedCount = applications.filter((a) => a.status === 'Approved').length;

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Applications</h1>
          <p className="dash-page__subtitle">Review contestant applications submitted through the Apply page.</p>
        </div>
      </div>

      <div className="dash-page__stats">
        <StatCard icon={ClipboardList} label="Total Applications" value={applications.length} />
        <StatCard icon={Clock3} label="Pending Review" value={pendingCount} />
        <StatCard icon={CheckCircle2} label="Approved" value={approvedCount} />
      </div>

      <DataTable
        columns={[
          { key: 'applicant', label: 'Applicant' },
          { key: 'category', label: 'Category' },
          { key: 'date', label: 'Submitted' },
          {
            key: 'status',
            label: 'Status',
            render: (row) => <Badge tone={TONE[row.status]}>{row.status}</Badge>,
          },
          {
            key: 'actions',
            label: 'Actions',
            render: (row) =>
              row.status === 'Pending' ? (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    className="btn btn--gold"
                    style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                    onClick={() => decide(row.id, 'Approved')}
                  >
                    <CheckCircle2 size={14} /> Approve
                  </button>
                  <button
                    type="button"
                    className="btn btn--outline"
                    style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                    onClick={() => decide(row.id, 'Rejected')}
                  >
                    <XCircle size={14} /> Reject
                  </button>
                </div>
              ) : (
                <span style={{ color: '#78746c', fontSize: '0.8rem' }}>—</span>
              ),
          },
        ]}
        rows={applications}
      />
    </div>
  );
}
