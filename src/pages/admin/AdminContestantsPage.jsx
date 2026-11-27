import { useState } from 'react';
import { Users, UserCheck, Award, Ban, CheckCircle2, Plus, User, Mail, Phone, Lock, LayoutGrid, BadgeCheck, Trash2 } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Field from '../../components/ui/Field';
import Notice from '../../components/ui/Notice';
import useApi from '../../hooks/useApi';
import { api, titleCase } from '../../api/client';
import { useAuth } from '../../auth/AuthContext';
import '../../components/auth/AuthForm.scss';
import '../../components/dashboard/DashboardPage.scss';

const STATUS_TONE = { ACTIVE: 'success', PENDING: 'warning', SUSPENDED: 'danger' };
const EMPTY_FORM = { fullName: '', email: '', phone: '', category: '', password: '', verified: true };

export default function AdminContestantsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const list = useApi('/admin/contestants', { limit: 100, sort: 'votes' });
  const stats = useApi('/admin/contestants/stats');
  const categories = useApi('/categories');
  const [notice, setNotice] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null); // row being deleted
  const [keepAccount, setKeepAccount] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const reload = () => {
    list.reload();
    stats.reload();
  };

  const run = async (fn, success) => {
    setNotice(null);
    try {
      const data = await fn();
      setNotice({ tone: 'success', text: success ?? data._message });
      reload();
    } catch (err) {
      setNotice({ tone: 'error', text: err.message });
    }
  };

  const toggleStatus = (row) =>
    run(() =>
      api(`/admin/contestants/${row.id}/status`, {
        method: 'PATCH',
        body: row.status === 'ACTIVE' ? { status: 'SUSPENDED', reason: 'Suspended from the admin dashboard.' } : { status: 'ACTIVE' },
      })
    );

  const toggleVerified = (row) =>
    run(() => api(`/admin/contestants/${row.id}/verify`, { method: 'PATCH', body: { verified: !row.verified } }));

  const confirmDelete = async () => {
    setDeleteError('');
    try {
      const data = await api(`/admin/contestants/${deleting.id}`, { method: 'DELETE', query: { keepAccount: keepAccount || undefined } });
      setNotice({ tone: 'success', text: data._message });
      setDeleting(null);
      reload();
    } catch (err) {
      setDeleteError(err.message);
    }
  };

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: field === 'verified' ? e.target.checked : e.target.value }));

  const openModal = () => {
    setForm({ ...EMPTY_FORM, category: categories.data?.categories?.[0]?.id ?? '' });
    setErrors({});
    setFormError('');
    setModalOpen(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setFormError('');
    try {
      const body = { ...form, phone: form.phone || undefined, password: form.password || undefined };
      const data = await api('/admin/contestants', { method: 'POST', body });
      setModalOpen(false);
      setNotice({
        tone: 'success',
        text: form.password
          ? `${form.fullName} can now log in on the Contestant tab with ${form.email} and the temporary password you set.`
          : data._message,
      });
      reload();
    } catch (err) {
      setErrors(err.fieldErrors);
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const rows = (list.data?.contestants ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    email: c.user.email,
    category: c.category.name,
    votes: c.voteCount,
    level: c.level.label,
    status: c.status,
    verified: c.verified,
  }));
  const s = stats.data;

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Contestants</h1>
          <p className="dash-page__subtitle">Review, approve, and manage every contestant on the platform.</p>
        </div>
        {isAdmin && (
          <button type="button" className="btn btn--gold" onClick={openModal}>
            <Plus size={16} /> Add Contestant
          </button>
        )}
      </div>

      <Notice tone={notice?.tone}>{notice?.text}</Notice>
      <Notice tone="error">{list.error?.message}</Notice>

      <div className="dash-page__stats">
        <StatCard icon={Users} label="Total Contestants" value={s?.total ?? '—'} />
        <StatCard icon={UserCheck} label="Active" value={s?.byStatus?.ACTIVE ?? '—'} />
        <StatCard icon={Award} label="Top Category" value={s?.topCategory?.category?.name ?? '—'} />
      </div>

      <DataTable
        emptyLabel={list.loading ? 'Loading…' : 'No contestants yet. Approve an application or add one.'}
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Login email' },
          { key: 'category', label: 'Category' },
          { key: 'votes', label: 'Votes', render: (row) => row.votes.toLocaleString() },
          { key: 'level', label: 'Level' },
          {
            key: 'status',
            label: 'Status',
            render: (row) => (
              <>
                <Badge tone={STATUS_TONE[row.status]}>{titleCase(row.status)}</Badge>{' '}
                {row.verified && <Badge tone="gold">Verified</Badge>}
              </>
            ),
          },
          {
            key: 'actions',
            label: 'Actions',
            render: (row) => (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className={`btn ${row.status === 'ACTIVE' ? 'btn--outline' : 'btn--gold'}`}
                  style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                  onClick={() => toggleStatus(row)}
                >
                  {row.status === 'ACTIVE' ? (
                    <>
                      <Ban size={14} /> Suspend
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={14} /> Activate
                    </>
                  )}
                </button>
                <button type="button" className="btn btn--outline" style={{ padding: '6px 14px', fontSize: '0.78rem' }} onClick={() => toggleVerified(row)}>
                  <BadgeCheck size={14} /> {row.verified ? 'Unverify' : 'Verify'}
                </button>
                {isAdmin && (
                  <button
                    type="button"
                    className="btn btn--outline"
                    style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                    aria-label={`Delete ${row.name}`}
                    title={row.votes > 0 ? 'Has votes: suspend instead' : 'Delete (added by mistake)'}
                    onClick={() => {
                      setDeleting(row);
                      setKeepAccount(false);
                      setDeleteError('');
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ),
          },
        ]}
        rows={rows}
      />

      <Modal isOpen={Boolean(deleting)} title={deleting ? `Delete ${deleting.name}?` : ''} onClose={() => setDeleting(null)}>
        {deleting && (
          <div style={{ display: 'grid', gap: 14, fontSize: '0.88rem' }}>
            <Notice tone="error">{deleteError}</Notice>
            {deleting.votes > 0 ? (
              <p>
                Fans have already voted for {deleting.name}, so this profile can&rsquo;t be deleted without erasing their votes.
                Use <strong>Suspend</strong> to hide it from the website instead.
              </p>
            ) : (
              <>
                <p>
                  Use this when a contestant was added by mistake. Their profile, photos, posts and messages are removed permanently.
                </p>
                <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input type="checkbox" checked={keepAccount} onChange={(e) => setKeepAccount(e.target.checked)} />
                  Keep their login ({deleting.email}) as a normal fan account
                </label>
                <p style={{ color: '#a8a49b', fontSize: '0.8rem' }}>
                  If the person already used the site as a fan (tickets, payments, votes), their account is always kept as a fan account.
                </p>
              </>
            )}
            <div style={{ display: 'flex', gap: 8 }}>
              {deleting.votes === 0 && (
                <button type="button" className="btn btn--gold" style={{ background: '#d13b3b', borderColor: '#d13b3b', color: '#fff' }} onClick={confirmDelete}>
                  <Trash2 size={15} /> Delete permanently
                </button>
              )}
              <button type="button" className="btn btn--outline" onClick={() => setDeleting(null)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={isModalOpen} title="Add Contestant" onClose={() => setModalOpen(false)}>
        <Notice tone="error">{formError}</Notice>
        <form className="auth-form" onSubmit={handleCreate} noValidate>
          <Field id="c-name" label="Full name" icon={User} error={errors.fullName}>
            <input id="c-name" type="text" value={form.fullName} onChange={update('fullName')} />
          </Field>
          <div className="auth-form__row">
            <Field id="c-email" label="Email (used to log in)" icon={Mail} error={errors.email}>
              <input id="c-email" type="email" value={form.email} onChange={update('email')} />
            </Field>
            <Field id="c-phone" label="Phone (optional)" icon={Phone} error={errors.phone}>
              <input id="c-phone" type="tel" placeholder="+250 7xx xxx xxx" value={form.phone} onChange={update('phone')} />
            </Field>
          </div>
          <Field id="c-category" label="Category" icon={LayoutGrid} error={errors.category} select>
            <select id="c-category" value={form.category} onChange={update('category')}>
              {(categories.data?.categories ?? []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field id="c-password" label="Temporary password (optional)" icon={Lock} error={errors.password}>
            <input id="c-password" type="text" placeholder="At least 8 characters" value={form.password} onChange={update('password')} />
          </Field>
          <p className="dash-page__subtitle" style={{ margin: 0 }}>
            With a temporary password the contestant can log in right away (share it with them privately). Leave it empty to email
            them a link to choose their own password instead.
          </p>
          <label className="auth-form__checkbox">
            <input type="checkbox" checked={form.verified} onChange={update('verified')} />
            Give the verified badge
          </label>
          <button type="submit" className="btn btn--gold auth-form__submit" disabled={saving}>
            {saving ? 'Creating…' : 'Create Contestant Account'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
