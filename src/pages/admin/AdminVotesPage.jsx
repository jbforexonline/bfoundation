import { useState } from 'react';
import { Vote, TrendingUp, Award, Calendar, Plus, User, LayoutGrid } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import '../../components/dashboard/DashboardPage.scss';
import '../../components/auth/AuthForm.scss';

const INITIAL_VOTES = [
  { id: 1, date: '2026-09-08 14:12', contestant: 'Ishimwe Kevin', category: 'Best Footballer', votes: 50, channel: 'Mobile Money' },
  { id: 2, date: '2026-09-08 13:47', contestant: 'Malaika Uwase', category: 'Best Musician', votes: 10, channel: 'Card' },
  { id: 3, date: '2026-09-08 12:30', contestant: 'Grace Umutoni', category: 'Best Influencer', votes: 100, channel: 'Mobile Money' },
  { id: 4, date: '2026-09-08 11:05', contestant: 'Divine Ingabire', category: 'Best Comedian', votes: 25, channel: 'Mobile Money' },
  { id: 5, date: '2026-09-08 09:52', contestant: 'Bruce Karenzi', category: 'Best Musician', votes: 10, channel: 'Card' },
  { id: 6, date: '2026-09-07 20:18', contestant: 'Emmanuel Ndayisenga', category: 'Best Footballer', votes: 50, channel: 'Mobile Money' },
];

const EMPTY_FORM = { contestant: '', category: '', votes: '' };

export default function AdminVotesPage() {
  const [votes, setVotes] = useState(INITIAL_VOTES);
  const [isModalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.contestant.trim() || !form.category.trim() || !form.votes) return;
    // TODO: call your real "record vote" endpoint here (this is for manual/admin adjustments only).
    setVotes((prev) => [
      {
        id: Date.now(),
        date: new Date().toISOString().slice(0, 16).replace('T', ' '),
        contestant: form.contestant,
        category: form.category,
        votes: Number(form.votes),
        channel: 'Manual (Admin)',
      },
      ...prev,
    ]);
    setForm(EMPTY_FORM);
    setModalOpen(false);
  };

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Votes</h1>
          <p className="dash-page__subtitle">Every vote transaction cast across the platform.</p>
        </div>
        <button type="button" className="btn btn--gold" onClick={() => setModalOpen(true)}>
          <Plus size={16} /> Add Vote
        </button>
      </div>

      <div className="dash-page__stats" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <StatCard icon={Vote} label="Votes Today" value="1,240" />
        <StatCard icon={TrendingUp} label="Votes This Month" value="51,200" sub="+18% vs last month" />
        <StatCard icon={Award} label="Leading Contestant" value="Ishimwe Kevin" />
        <StatCard icon={Calendar} label="Last Vote" value="2 min ago" />
      </div>

      <DataTable
        columns={[
          { key: 'date', label: 'Date & Time' },
          { key: 'contestant', label: 'Contestant' },
          { key: 'category', label: 'Category' },
          { key: 'votes', label: 'Votes' },
          { key: 'channel', label: 'Channel' },
        ]}
        rows={votes}
      />

      <Modal isOpen={isModalOpen} title="Add Vote" onClose={() => setModalOpen(false)}>
        <form className="auth-form" onSubmit={handleAdd} noValidate>
          <div className="auth-form__field">
            <label htmlFor="vote-contestant">Contestant</label>
            <div className="auth-form__input-wrap">
              <User size={16} />
              <input
                id="vote-contestant"
                type="text"
                placeholder="Contestant name"
                value={form.contestant}
                onChange={update('contestant')}
              />
            </div>
          </div>

          <div className="auth-form__field">
            <label htmlFor="vote-category">Category</label>
            <div className="auth-form__input-wrap">
              <LayoutGrid size={16} />
              <input
                id="vote-category"
                type="text"
                placeholder="e.g. Best Musician"
                value={form.category}
                onChange={update('category')}
              />
            </div>
          </div>

          <div className="auth-form__field">
            <label htmlFor="vote-count">Votes</label>
            <div className="auth-form__input-wrap">
              <Vote size={16} />
              <input
                id="vote-count"
                type="number"
                min="1"
                placeholder="e.g. 10"
                value={form.votes}
                onChange={update('votes')}
              />
            </div>
          </div>

          <button type="submit" className="btn btn--gold auth-form__submit">Add Vote</button>
        </form>
      </Modal>
    </div>
  );
}
