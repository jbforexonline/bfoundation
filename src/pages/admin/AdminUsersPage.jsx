import { useEffect, useState } from 'react';
import { Users, UserPlus, ShieldCheck, Mail, User, Phone, Ban, CheckCircle2, Send, Search } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Field from '../../components/ui/Field';
import Notice from '../../components/ui/Notice';
import useApi from '../../hooks/useApi';
import { api, formatDate, timeAgo, titleCase } from '../../api/client';
import { useAuth } from '../../auth/AuthContext';
import '../../components/auth/AuthForm.scss';
import '../../components/dashboard/DashboardPage.scss';

const ROLE_TONE = { ADMIN: 'gold', MODERATOR: 'neutral', CONTESTANT: 'success', FAN: 'neutral' };
const STATUS_TONE = { ACTIVE: 'success', INACTIVE: 'warning', SUSPENDED: 'danger' };
const small = { padding: '6px 12px', fontSize: '0.78rem' };
const EMPTY = { fullName: '', email: '', phone: '', role: 'MODERATOR' };

// All accounts: fans, contestants, moderators and admins. Contestants are created on the Contestants page.
export default function AdminUsersPage() {
  const { user: me } = useAuth();
  const isAdmin = me?.role === 'ADMIN';
  const [role, setRole] = useState('');
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setSearch(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);
  const { data, error, loading, reload } = useApi('/admin/users', { limit: 100, role: role || undefined, search: search || undefined });
  const stats = useApi('/admin/users/stats');
  const [notice, setNotice] = useState(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');

  const run = async (fn) => {
    setNotice(null);
    try {
      const d = await fn();
      setNotice({ tone: 'success', text: d._message });
      reload();
      stats.reload();
    } catch (err) {
      setNotice({ tone: 'error', text: err.message });
    }
  };

  const create = async (e) => {
    e.preventDefault();
    setErrors({});
    setFormError('');
    try {
      const d = await api('/admin/users', { method: 'POST', body: { ...form, phone: form.phone || undefined } });
      setNotice({ tone: 'success', text: `${d._message} ${form.email} was emailed a link to set their password.` });
      setCreating(false);
      setForm(EMPTY);
      reload();
      stats.reload();
    } catch (err) {
      setErrors(err.fieldErrors);
      setFormError(err.message);
    }
  };

  const setStatus = (u, status) => {
    const reason = status === 'SUSPENDED' ? window.prompt(`Why are you suspending ${u.name}? (optional)`) : undefined;
    if (reason === null) return; // cancelled
    run(() => api(`/admin/users/${u.id}/status`, { method: 'PATCH', body: { status, reason: reason || undefined } }));
  };

  const users = data?.users ?? [];
  const s = stats.data;
  const rows = users.map((u) => ({ id: u.id, name: u.name, email: u.email, role: u.role, status: u.status, raw: u }));

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Users</h1>
          <p className="dash-page__subtitle">Every account on the platform. Add moderators and admins here; contestants are added on the Contestants page.</p>
        </div>
        {isAdmin && (
          <button type="button" className="btn btn--gold" onClick={() => { setCreating(true); setErrors({}); setFormError(''); }}>
            <UserPlus size={16} /> Add Staff Account
          </button>
        )}
      </div>

      <Notice tone={notice?.tone}>{notice?.text}</Notice>
      <Notice tone="error">{error?.message}</Notice>

      <div className="dash-page__stats" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <StatCard icon={Users} label="Total Accounts" value={s?.total ?? '—'} sub={s ? `${s.newThisMonth} new this month` : undefined} />
        <StatCard icon={User} label="Fans" value={s?.byRole.FAN ?? '—'} sub={s ? `${s.emailVerified} verified emails` : undefined} />
        <StatCard icon={CheckCircle2} label="Contestants" value={s?.byRole.CONTESTANT ?? '—'} />
        <StatCard icon={ShieldCheck} label="Staff" value={s ? s.byRole.ADMIN + s.byRole.MODERATOR : '—'} sub={s ? `${s.byStatus.SUSPENDED} suspended accounts` : undefined} />
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12, alignItems: 'center' }}>
        {[
          ['', 'All'],
          ['FAN', 'Fans'],
          ['CONTESTANT', 'Contestants'],
          ['MODERATOR', 'Moderators'],
          ['ADMIN', 'Admins'],
        ].map(([v, l]) => (
          <button key={v} type="button" className={`btn ${role === v ? 'btn--gold' : 'btn--outline'}`} style={small} onClick={() => setRole(v)}>
            {l}
          </button>
        ))}
        <div className="data-table__search" style={{ marginLeft: 'auto', maxWidth: 280, marginBottom: 0 }}>
          <Search size={16} />
          <input type="text" placeholder="Name, email or phone…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>

      <DataTable
        searchable={false}
        emptyLabel={loading ? 'Loading…' : 'No accounts match.'}
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email', render: (row) => <span>{row.email}{!row.raw.emailVerified && <span style={{ color: '#a8a49b' }}> (unverified)</span>}</span> },
          { key: 'role', label: 'Role', render: (row) => <Badge tone={ROLE_TONE[row.role]}>{titleCase(row.role)}</Badge> },
          { key: 'status', label: 'Status', render: (row) => <Badge tone={STATUS_TONE[row.status]}>{titleCase(row.status)}</Badge> },
          { key: 'joined', label: 'Joined', render: (row) => formatDate(row.raw.createdAt) },
          { key: 'last', label: 'Last login', render: (row) => (row.raw.lastLoginAt ? timeAgo(row.raw.lastLoginAt) : 'Never') },
          {
            key: 'actions',
            label: 'Actions',
            render: (row) => {
              if (row.id === me?.id) return <span style={{ color: '#78746c', fontSize: '0.8rem' }}>You</span>;
              const u = row.raw;
              return (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {u.status === 'ACTIVE' ? (
                    <button type="button" className="btn btn--outline" style={small} onClick={() => setStatus(u, 'SUSPENDED')}>
                      <Ban size={14} /> Suspend
                    </button>
                  ) : (
                    <button type="button" className="btn btn--gold" style={small} onClick={() => setStatus(u, 'ACTIVE')}>
                      <CheckCircle2 size={14} /> Activate
                    </button>
                  )}
                  {isAdmin && ['FAN', 'MODERATOR', 'ADMIN'].includes(u.role) && (
                    <select
                      value={u.role}
                      aria-label="Change role"
                      onChange={(e) =>
                        window.confirm(`Make ${u.name} a ${titleCase(e.target.value)}?`) &&
                        run(() => api(`/admin/users/${u.id}/role`, { method: 'PATCH', body: { role: e.target.value } }))
                      }
                      style={{ background: '#16130d', color: '#e9e6df', border: '1px solid #2e2a22', borderRadius: 6, fontSize: '0.78rem', padding: '5px 6px' }}
                    >
                      <option value="FAN">Fan</option>
                      <option value="MODERATOR">Moderator</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  )}
                  {isAdmin && !u.hasPassword && (
                    <button
                      type="button"
                      className="btn btn--outline"
                      style={small}
                      title="Email the set-password link again"
                      onClick={() => run(() => api(`/admin/users/${u.id}/resend-invite`, { method: 'POST' }))}
                    >
                      <Send size={14} /> Invite
                    </button>
                  )}
                </div>
              );
            },
          },
        ]}
        rows={rows}
      />

      <Modal isOpen={creating} title="Add staff account" onClose={() => setCreating(false)}>
        <form className="auth-form" onSubmit={create} noValidate>
          <Notice tone="error">{formError}</Notice>
          <Field id="u-name" label="Full name" icon={User} error={errors.fullName}>
            <input id="u-name" type="text" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          </Field>
          <Field id="u-email" label="Email" icon={Mail} error={errors.email}>
            <input id="u-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Field>
          <div className="auth-form__row">
            <Field id="u-phone" label="Phone (optional)" icon={Phone} error={errors.phone}>
              <input id="u-phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </Field>
            <Field id="u-role" label="Role" icon={ShieldCheck} error={errors.role} select>
              <select id="u-role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="MODERATOR">Moderator</option>
                <option value="ADMIN">Admin</option>
                <option value="FAN">Fan</option>
              </select>
            </Field>
          </div>
          <p style={{ color: '#a8a49b', fontSize: '0.82rem' }}>They receive an email with a link to choose their password.</p>
          <button type="submit" className="btn btn--gold auth-form__submit">
            Create account
          </button>
        </form>
      </Modal>
    </div>
  );
}
