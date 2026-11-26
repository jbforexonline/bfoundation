import { useState } from 'react';
import { ClipboardList, Clock3, CheckCircle2, XCircle, Lock, FileText, Eye } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Field from '../../components/ui/Field';
import Notice from '../../components/ui/Notice';
import useApi from '../../hooks/useApi';
import { api, formatDate, titleCase } from '../../api/client';
import { useAuth } from '../../auth/AuthContext';
import '../../components/auth/AuthForm.scss';
import '../../components/dashboard/DashboardPage.scss';

const TONE = { PENDING: 'warning', APPROVED: 'success', REJECTED: 'danger' };

// Applications come from the website's "Apply" page. Approving one creates the contestant account.
export default function AdminApplicationsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const { data, error, loading, reload } = useApi('/admin/applications', { limit: 100 });
  const [notice, setNotice] = useState(null);
  const [selected, setSelected] = useState(null); // application being viewed / reviewed
  const [mode, setMode] = useState(null); // 'view' | 'approve' | 'reject'
  const [form, setForm] = useState({ password: '', verified: true, reason: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const open = (app, m) => {
    setSelected(app);
    setMode(m);
    setForm({ password: '', verified: true, reason: '' });
    setErrors({});
    setFormError('');
  };
  const close = () => setMode(null);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setFormError('');
    try {
      if (mode === 'approve') {
        await api(`/admin/applications/${selected.id}/approve`, {
          method: 'POST',
          body: { verified: form.verified, password: form.password || undefined },
        });
        setNotice({
          tone: 'success',
          text: form.password
            ? `Approved. ${selected.fullName} can log in now on the Contestant tab with ${selected.email} and the temporary password you set.`
            : `Approved. ${selected.fullName} was emailed a link to set their password, then log in on the Contestant tab.`,
        });
      } else {
        await api(`/admin/applications/${selected.id}/reject`, { method: 'POST', body: { reason: form.reason || undefined } });
        setNotice({ tone: 'success', text: `Application from ${selected.fullName} rejected. They were notified by email.` });
      }
      close();
      reload();
    } catch (err) {
      setErrors(err.fieldErrors);
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const apps = data?.applications ?? [];
  const rows = apps.map((a) => ({
    id: a.id,
    applicant: a.fullName,
    email: a.email,
    category: a.category.name,
    date: formatDate(a.createdAt),
    status: a.status,
    raw: a,
  }));
  const stats = data?.stats;

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Applications</h1>
          <p className="dash-page__subtitle">Review contestant applications submitted from the website’s Apply page.</p>
        </div>
      </div>

      <Notice tone={notice?.tone}>{notice?.text}</Notice>
      <Notice tone="error">{error?.message}</Notice>

      <div className="dash-page__stats">
        <StatCard icon={ClipboardList} label="Total Applications" value={stats?.total ?? '—'} />
        <StatCard icon={Clock3} label="Pending Review" value={stats?.pending ?? '—'} />
        <StatCard icon={CheckCircle2} label="Approved" value={stats?.approved ?? '—'} />
      </div>

      <DataTable
        emptyLabel={loading ? 'Loading…' : 'No applications yet. They appear here when someone applies on the website.'}
        columns={[
          { key: 'applicant', label: 'Applicant' },
          { key: 'email', label: 'Email' },
          { key: 'category', label: 'Category' },
          { key: 'date', label: 'Submitted' },
          { key: 'status', label: 'Status', render: (row) => <Badge tone={TONE[row.status]}>{titleCase(row.status)}</Badge> },
          {
            key: 'actions',
            label: 'Actions',
            render: (row) => (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button type="button" className="btn btn--outline" style={{ padding: '6px 12px', fontSize: '0.78rem' }} onClick={() => open(row.raw, 'view')}>
                  <Eye size={14} /> View
                </button>
                {row.status === 'PENDING' && (
                  <>
                    {isAdmin && (
                      <button type="button" className="btn btn--gold" style={{ padding: '6px 12px', fontSize: '0.78rem' }} onClick={() => open(row.raw, 'approve')}>
                        <CheckCircle2 size={14} /> Approve
                      </button>
                    )}
                    <button type="button" className="btn btn--outline" style={{ padding: '6px 12px', fontSize: '0.78rem' }} onClick={() => open(row.raw, 'reject')}>
                      <XCircle size={14} /> Reject
                    </button>
                  </>
                )}
              </div>
            ),
          },
        ]}
        rows={rows}
      />

      <Modal
        isOpen={Boolean(mode)}
        title={mode === 'approve' ? 'Approve application' : mode === 'reject' ? 'Reject application' : 'Application'}
        onClose={close}
      >
        {selected && (
          <div style={{ fontSize: '0.88rem', lineHeight: 1.6, marginBottom: 16 }}>
            <p>
              <strong>{selected.fullName}</strong> — {selected.category.name}
            </p>
            <p>
              {selected.email} · {selected.phone}
            </p>
            {selected.portfolioUrl && (
              <p>
                <a href={selected.portfolioUrl} target="_blank" rel="noreferrer" style={{ color: '#f0a93a' }}>
                  {selected.portfolioUrl}
                </a>
              </p>
            )}
            <p style={{ marginTop: 8, color: '#a8a49b' }}>“{selected.pitch}”</p>
            {selected.reviewNote && <p style={{ marginTop: 8 }}>Review note: {selected.reviewNote}</p>}
          </div>
        )}

        {mode !== 'view' && (
          <>
            <Notice tone="error">{formError}</Notice>
            <form className="auth-form" onSubmit={submit} noValidate>
              {mode === 'approve' ? (
                <>
                  <Field id="ap-password" label="Temporary password (optional)" icon={Lock} error={errors.password}>
                    <input id="ap-password" type="text" placeholder="At least 8 characters" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                  </Field>
                  <p className="dash-page__subtitle" style={{ margin: 0 }}>
                    With a temporary password the contestant can log in right away. Leave it empty to email them a link to set their own.
                  </p>
                  <label className="auth-form__checkbox">
                    <input type="checkbox" checked={form.verified} onChange={(e) => setForm({ ...form, verified: e.target.checked })} />
                    Give the verified badge
                  </label>
                  <button type="submit" className="btn btn--gold auth-form__submit" disabled={saving}>
                    {saving ? 'Approving…' : 'Approve & create contestant account'}
                  </button>
                </>
              ) : (
                <>
                  <Field id="rj-reason" label="Reason (sent to the applicant, optional)" icon={FileText} error={errors.reason}>
                    <input id="rj-reason" type="text" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
                  </Field>
                  <button type="submit" className="btn btn--gold auth-form__submit" disabled={saving}>
                    {saving ? 'Rejecting…' : 'Reject application'}
                  </button>
                </>
              )}
            </form>
          </>
        )}
      </Modal>
    </div>
  );
}
