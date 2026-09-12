import { useState } from 'react';
import { Users, UserCheck, Award, Ban, CheckCircle2 } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import '../../components/dashboard/DashboardPage.scss';

const INITIAL_CONTESTANTS = [
  { id: 1, name: 'Malaika Uwase', category: 'Best Musician', votes: 18420, status: 'Active' },
  { id: 2, name: 'Ishimwe Kevin', category: 'Best Footballer', votes: 21040, status: 'Active' },
  { id: 3, name: 'Grace Umutoni', category: 'Best Influencer', votes: 13500, status: 'Active' },
  { id: 4, name: 'Divine Ingabire', category: 'Best Comedian', votes: 9640, status: 'Active' },
  { id: 5, name: 'Bruce Karenzi', category: 'Best Musician', votes: 15310, status: 'Suspended' },
  { id: 6, name: 'Emmanuel Ndayisenga', category: 'Best Footballer', votes: 17760, status: 'Active' },
  { id: 7, name: 'Claudine Mukamana', category: 'Best Influencer', votes: 11890, status: 'Active' },
  { id: 8, name: 'Sandrine Uwera', category: 'Best Comedian', votes: 8120, status: 'Suspended' },
];

export default function AdminContestantsPage() {
  const [contestants, setContestants] = useState(INITIAL_CONTESTANTS);

  const toggleStatus = (id) => {
    setContestants((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: c.status === 'Active' ? 'Suspended' : 'Active' } : c
      )
    );
    // TODO: call your real "update contestant status" endpoint here.
  };

  const activeCount = contestants.filter((c) => c.status === 'Active').length;
  const topCategory = 'Best Musician';

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Contestants</h1>
          <p className="dash-page__subtitle">Review, approve, and manage every contestant on the platform.</p>
        </div>
      </div>

      <div className="dash-page__stats">
        <StatCard icon={Users} label="Total Contestants" value={contestants.length} />
        <StatCard icon={UserCheck} label="Active" value={activeCount} />
        <StatCard icon={Award} label="Top Category" value={topCategory} />
      </div>

      <DataTable
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'category', label: 'Category' },
          { key: 'votes', label: 'Votes', render: (row) => row.votes.toLocaleString() },
          {
            key: 'status',
            label: 'Status',
            render: (row) => <Badge tone={row.status === 'Active' ? 'success' : 'danger'}>{row.status}</Badge>,
          },
          {
            key: 'actions',
            label: 'Actions',
            render: (row) => (
              <button
                type="button"
                className={`btn ${row.status === 'Active' ? 'btn--outline' : 'btn--gold'}`}
                style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                onClick={() => toggleStatus(row.id)}
              >
                {row.status === 'Active' ? (
                  <>
                    <Ban size={14} /> Suspend
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={14} /> Activate
                  </>
                )}
              </button>
            ),
          },
        ]}
        rows={contestants}
      />
    </div>
  );
}
