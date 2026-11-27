import { useState } from 'react';
import { Megaphone, Clock3, CheckCircle2, XCircle, Mail, Phone, Lock, Eye, Trash2, Star } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Field from '../../components/ui/Field';
import Notice from '../../components/ui/Notice';
import useApi from '../../hooks/useApi';
import { api, formatDate } from '../../api/client';
import { useAuth } from '../../auth/AuthContext';
import '../../components/auth/AuthForm.scss';
import '../../components/dashboard/DashboardPage.scss';

const STATUS = {
  PENDING: ['warning', 'Collecting support'],
  QUALIFIED_FOR_REVIEW: ['gold', 'Ready for review'],
  APPROVED: ['success', 'Approved'],
  REJECTED: ['danger', 'Rejected'],
};
const FILTERS = [
  ['', 'All'],
  ['QUALIFIED_FOR_REVIEW', 'Ready for review'],
  ['PENDING', 'Collecting support'],
  ['APPROVED', 'Approved'],
  ['REJECTED', 'Rejected'],
];
const small = { padding: '6px 12px', fontSize: '0.78rem' };

// Community nominations from the website. Approving one creates an "Official Nominee" contestant.
export default function AdminNominationsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const [filter, setFilter] = useState('');
  const { data, error, loading, reload } = useApi('/admin/nominations', { limit: 100, status: filter || undefined, sort: 'support' });
  const [notice, setNotice] = useState(null);
  const [selected, setSelected] = useState(null);
  const [mode, setMode] = useState(null); // 'view' | 'approve' | 'reject'
  const [form, setForm] = useState({ email: '', phone: '', password: '', verified: true, reason: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const open = (n, m) => {
    setSelected(n);
    setMode(m);
    setForm({ email: n.nomineeEmail ?? '', phone: n.nomineePhone ?? '', password: '', verified: true, reason: '' });
    setErrors({});
    setFormError('');
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setFormError('');
    try {
      if (mode === 'approve') {
        await api(`/admin/nominations/${selected.id}/approve`, {
          method: 'POST',
          body: { email: form.email || undefined, phone: form.phone || undefined, password: form.password || undefined, verified: form.verified },
        });
        setNotice({
          tone: 'success',
          text: form.password
            ? `${selected.nomineeName} is now an Official Nominee and can log in on the Contestant tab with ${form.email} and the temporary password.`
            : `${selected.nomineeName} is now an Official Nominee. They were emailed a link to set their password.`,
        });
      } else {
        await api(`/admin/nominations/${selected.id}/reject`, { method: 'POST', body: { reason: form.reason || undefined } });
        setNotice({ tone: 'success', text: `Nomination of ${selected.nomineeName} rejected. The nominator was told by email.` });
      }
      setMode(null);
      reload();
    } catch (err) {
      setErrors(err.fieldErrors);
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (n) => {
    if (!window.confirm(`Remove the nomination of ${n.nomineeName}? It will be hidden everywhere.`)) return;
    try {
      await api(`/admin/nominations/${n.id}`, { method: 'DELETE', body: {} });
      setNotice({ tone: 'success', text: 'Nomination removed.' });
      reload();
    } catch (err) {
      setNotice({ tone: 'error', text: err.message });
    }
  };

  const stats = data?.stats;
  const rows = (data?.nominations ?? []).map((n) => ({
    id: n.id,
    nominee: n.nomineeName,
    category: n.category.name,
    support: `${n.supporters} / ${n.threshold}`,
    by: n.nominatedBy,
    date: formatDate(n.createdAt),
    status: n.status,
    raw: n,
  }));

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Nominations</h1>
          <p className="dash-page__subtitle">
            Community nominations from the website. At {data?.settings?.threshold ?? '…'} supports they are ready for review.
          </p>
        </div>
      </div>

      <Notice tone={notice?.tone}>{notice?.text}</Notice>
      <Notice tone="error">{error?.message}</Notice>

      <div className="dash-page__stats">
        <StatCard icon={Megaphone} label="Total Nominations" value={stats?.total ?? '—'} />
        <StatCard icon={Clock3} label="Ready for Review" value={stats?.qualified ?? '—'} sub={stats ? `${stats.pending} still collecting support` : undefined} />
        <StatCard icon={Star} label="Official Nominees" value={stats?.approved ?? '—'} />
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        {FILTERS.map(([v, l]) => (
          <button key={v} type="button" className={`btn ${filter === v ? 'btn--gold' : 'btn--outline'}`} style={small} onClick={() => setFilter(v)}>
            {l}
          </button>
        ))}
      </div>

      <DataTable
        emptyLabel={loading ? 'Loading…' : 'No nominations here.'}
        columns={[
          { key: 'nominee', label: 'Nominee' },
          { key: 'category', label: 'Category' },
          { key: 'support', label: 'Supports' },
          { key: 'by', label: 'Nominated by' },
          { key: 'date', label: 'Date' },
          {
            key: 'status',
            label: 'Status',
            render: (row) => <Badge tone={STATUS[row.status]?.[0]}>{STATUS[row.status]?.[1] ?? row.status}</Badge>,
          },
          {
            key: 'actions',
            label: 'Actions',
            render: (row) => {
              const openForReview = ['PENDING', 'QUALIFIED_FOR_REVIEW'].includes(row.status);
              return (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <button type="button" className="btn btn--outline" style={small} onClick={() => open(row.raw, 'view')}>
                    <Eye size={14} /> View
                  </button>
                  {openForReview && isAdmin && (
                    <button type="button" className="btn btn--gold" style={small} onClick={() => open(row.raw, 'approve')}>
                      <CheckCircle2 size={14} /> Approve
                    </button>
                  )}
                  {openForReview && (
                    <button type="button" className="btn btn--outline" style={small} onClick={() => open(row.raw, 'reject')}>
                      <XCircle size={14} /> Reject
                    </button>
                  )}
                  {isAdmin && row.status !== 'APPROVED' && (
                    <button type="button" className="btn btn--outline" style={small} aria-label="Remove" onClick={() => remove(row.raw)}>
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              );
            },
          },
        ]}
        rows={rows}
      />

      <Modal
        isOpen={Boolean(mode)}
        title={mode === 'approve' ? `Approve ${selected?.nomineeName}` : mode === 'reject' ? 'Reject nomination' : selected?.nomineeName ?? ''}
        onClose={() => setMode(null)}
      >
        {selected && mode === 'view' && (
          <div style={{ display: 'grid', gap: 8, fontSize: '0.88rem' }}>
            <p>
              <strong>Category:</strong> {selected.category.name} · <strong>Supports:</strong> {selected.supporters} / {selected.threshold}
            </p>
            <p>
              <strong>Nominated by:</strong> {selected.nominatedBy} ({selected.nominatorEmail})
            </p>
            <p>
              <strong>Nominee contact:</strong> {selected.nomineeEmail || 'no email yet'}
              {selected.nomineePhone ? ` · ${selected.nomineePhone}` : ''}
            </p>
            <p style={{ whiteSpace: 'pre-line' }}>
              <strong>Why:</strong> {selected.reason}
            </p>
          </div>
        )}
        {selected && mode !== 'view' && (
          <form className="auth-form" onSubmit={submit} noValidate>
            <Notice tone="error">{formError}</Notice>
            {mode === 'approve' ? (
              <>
                <p style={{ color: '#a8a49b', fontSize: '0.85rem' }}>
                  This creates a contestant account for {selected.nomineeName} in {selected.category.name}, with the Official Nominee badge.
                </p>
                <Field id="nom-email" label="Nominee email (required)" icon={Mail} error={errors.email}>
                  <input id="nom-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </Field>
                <Field id="nom-phone" label="Nominee phone (optional)" icon={Phone} error={errors.phone}>
                  <input id="nom-phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </Field>
                <Field id="nom-pw" label="Temporary password (optional)" icon={Lock} error={errors.password}>
                  <input
                    id="nom-pw"
                    type="text"
                    placeholder="Leave empty to email a set-password link"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                </Field>
                <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.85rem' }}>
                  <input type="checkbox" checked={form.verified} onChange={(e) => setForm({ ...form, verified: e.target.checked })} />
                  Mark as verified
                </label>
              </>
            ) : (
              <Field id="nom-reason" label="Reason (sent to the nominator)" error={errors.reason}>
                <textarea id="nom-reason" rows={3} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
              </Field>
            )}
            <button type="submit" className="btn btn--gold auth-form__submit" disabled={saving}>
              {saving ? 'Saving…' : mode === 'approve' ? 'Approve & create contestant' : 'Reject nomination'}
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
}
