import { useState } from 'react';
import { Vote, TrendingUp, Award, Calendar, Plus, User, FileText } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import Field from '../../components/ui/Field';
import Notice from '../../components/ui/Notice';
import useApi from '../../hooks/useApi';
import { api, formatDateTime } from '../../api/client';
import { useAuth } from '../../auth/AuthContext';
import '../../components/dashboard/DashboardPage.scss';
import '../../components/auth/AuthForm.scss';

const EMPTY_FORM = { contestantId: '', votes: '', reason: '' };

function timeAgo(date) {
  if (!date) return '—';
  const mins = Math.round((Date.now() - new Date(date).getTime()) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} h ago`;
  return `${Math.round(hours / 24)} d ago`;
}

export default function AdminVotesPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const votes = useApi('/admin/votes', { limit: 100 });
  const stats = useApi('/admin/votes/stats');
  const contestants = useApi(isAdmin ? '/admin/contestants' : null, { limit: 100, sort: 'name' });
  const [isModalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [notice, setNotice] = useState(null);

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  // Manual correction (e.g. offline ballots, removing fraudulent votes). Positive or negative, always audited.
  const handleAdd = async (e) => {
    e.preventDefault();
    setErrors({});
    setFormError('');
    try {
      const res = await api('/admin/votes/adjustments', { method: 'POST', body: form });
      setModalOpen(false);
      setForm(EMPTY_FORM);
      setNotice({ tone: 'success', text: `Recorded. ${res.contestant.name} now has ${res.contestant.voteCount.toLocaleString()} votes.` });
      votes.reload();
      stats.reload();
      contestants.reload();
    } catch (err) {
      setErrors(err.fieldErrors);
      setFormError(err.message);
    }
  };

  const rows = (votes.data?.votes ?? []).map((v) => ({
    id: v.id,
    date: formatDateTime(v.createdAt),
    contestant: v.contestant?.name ?? '—',
    category: v.category.name,
    votes: v.votes,
    channel: v.channel,
    by: v.voter?.name ?? v.createdBy?.name ?? '—',
  }));
  const s = stats.data;
  const change = s?.monthOverMonthChange;

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Votes</h1>
          <p className="dash-page__subtitle">Every vote cast across the platform. Exact numbers are visible to staff only.</p>
        </div>
        {isAdmin && (
          <button type="button" className="btn btn--gold" onClick={() => setModalOpen(true)}>
            <Plus size={16} /> Adjust Votes
          </button>
        )}
      </div>

      <Notice tone={notice?.tone}>{notice?.text}</Notice>
      <Notice tone="error">{votes.error?.message}</Notice>

      <div className="dash-page__stats" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <StatCard icon={Vote} label="Votes Today" value={s?.votesToday?.toLocaleString() ?? '—'} />
        <StatCard
          icon={TrendingUp}
          label="Votes This Month"
          value={s?.votesThisMonth?.toLocaleString() ?? '—'}
          sub={change === null || change === undefined ? undefined : `${change >= 0 ? '+' : ''}${change}% vs last month`}
        />
        <StatCard icon={Award} label="Leading Contestant" value={s?.leadingContestant?.name ?? '—'} />
        <StatCard icon={Calendar} label="Last Vote" value={timeAgo(s?.lastVoteAt)} />
      </div>

      <DataTable
        emptyLabel={votes.loading ? 'Loading…' : 'No votes yet.'}
        columns={[
          { key: 'date', label: 'Date & Time' },
          { key: 'contestant', label: 'Contestant' },
          { key: 'category', label: 'Category' },
          { key: 'votes', label: 'Votes' },
          { key: 'channel', label: 'Channel' },
          { key: 'by', label: 'Voter / Admin' },
        ]}
        rows={rows}
      />

      <Modal isOpen={isModalOpen} title="Adjust Votes" onClose={() => setModalOpen(false)}>
        <Notice tone="error">{formError}</Notice>
        <form className="auth-form" onSubmit={handleAdd} noValidate>
          <Field id="vote-contestant" label="Contestant" icon={User} error={errors.contestantId} select>
            <select id="vote-contestant" value={form.contestantId} onChange={update('contestantId')}>
              <option value="">Choose a contestant…</option>
              {(contestants.data?.contestants ?? []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.category.name} ({c.voteCount.toLocaleString()} votes)
                </option>
              ))}
            </select>
          </Field>
          <Field id="vote-count" label="Votes (use a minus sign to remove)" icon={Vote} error={errors.votes}>
            <input id="vote-count" type="number" placeholder="e.g. 10 or -5" value={form.votes} onChange={update('votes')} />
          </Field>
          <Field id="vote-reason" label="Reason (kept in the audit log)" icon={FileText} error={errors.reason}>
            <input id="vote-reason" type="text" placeholder="e.g. Offline ballots from the gala" value={form.reason} onChange={update('reason')} />
          </Field>
          <button type="submit" className="btn btn--gold auth-form__submit">
            Record adjustment
          </button>
        </form>
      </Modal>
    </div>
  );
}
