import { useState } from 'react';
import { Handshake, Award, Clock3, CheckCircle2, Plus, Mail, Globe, User, Phone, EyeOff, Trash2, Upload, Pencil } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Field from '../../components/ui/Field';
import Notice from '../../components/ui/Notice';
import useApi from '../../hooks/useApi';
import { api, formatDate, initialsOf, titleCase } from '../../api/client';
import { useAuth } from '../../auth/AuthContext';
import '../../components/dashboard/DashboardPage.scss';
import '../../components/auth/AuthForm.scss';

const TIER_TONE = { PLATINUM: 'neutral', GOLD: 'gold', SILVER: 'neutral' };
const STATUS_TONE = { ACTIVE: 'success', PENDING: 'warning', INACTIVE: 'danger' };
const TIERS = ['PLATINUM', 'GOLD', 'SILVER'];
const EMPTY_FORM = { companyName: '', packageType: 'SILVER', contactEmail: '', contactName: '', contactPhone: '', website: '' };
const small = { padding: '6px 12px', fontSize: '0.78rem' };

// Sponsors shown on the website's Sponsors page, plus "Become a sponsor" requests from the website.
export default function AdminSponsorsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const [filter, setFilter] = useState('');
  const { data, error, loading, reload } = useApi('/admin/sponsors', { limit: 100, status: filter || undefined });
  const stats = useApi('/admin/sponsors/stats');
  const [notice, setNotice] = useState(null);
  const [editing, setEditing] = useState(null); // null | 'new' | sponsor
  const [viewing, setViewing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const refresh = () => {
    reload();
    stats.reload();
  };

  const run = async (fn, success) => {
    setNotice(null);
    try {
      const d = await fn();
      setNotice({ tone: 'success', text: success ?? d._message });
      refresh();
    } catch (err) {
      setNotice({ tone: 'error', text: err.message });
    }
  };

  const openForm = (sponsor) => {
    setEditing(sponsor ?? 'new');
    setForm(
      sponsor
        ? {
            companyName: sponsor.companyName,
            packageType: sponsor.packageType,
            contactEmail: sponsor.contactEmail,
            contactName: sponsor.contactName ?? '',
            contactPhone: sponsor.contactPhone ?? '',
            website: sponsor.website ?? '',
          }
        : EMPTY_FORM
    );
    setErrors({});
    setFormError('');
  };

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setFormError('');
    try {
      const d =
        editing === 'new'
          ? await api('/admin/sponsors', { method: 'POST', body: form })
          : await api(`/admin/sponsors/${editing.id}`, { method: 'PATCH', body: form });
      setNotice({ tone: 'success', text: d._message });
      setEditing(null);
      refresh();
    } catch (err) {
      setErrors(err.fieldErrors);
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const uploadLogo = (s) => {
    const input = Object.assign(document.createElement('input'), { type: 'file', accept: 'image/png,image/jpeg,image/webp' });
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('logo', file);
      run(() => api(`/admin/sponsors/${s.id}/logo`, { method: 'POST', form: formData }), `Logo uploaded for ${s.companyName}.`);
    };
    input.click();
  };

  const sponsors = data?.sponsors ?? [];
  const rows = sponsors.map((s) => ({
    id: s.id,
    name: s.companyName,
    tier: s.packageType,
    contact: s.contactEmail,
    status: s.status,
    raw: s,
  }));

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Sponsors</h1>
          <p className="dash-page__subtitle">Partners on the website’s Sponsors page and “Become a sponsor” requests.</p>
        </div>
        {isAdmin && (
          <button type="button" className="btn btn--gold" onClick={() => openForm(null)}>
            <Plus size={16} /> Add Sponsor
          </button>
        )}
      </div>

      <Notice tone={notice?.tone}>{notice?.text}</Notice>
      <Notice tone="error">{error?.message}</Notice>

      <div className="dash-page__stats">
        <StatCard icon={Handshake} label="Active Sponsors" value={stats.data?.active ?? '—'} sub={stats.data ? `${stats.data.total} in total` : undefined} />
        <StatCard icon={Award} label="Platinum Partners" value={stats.data?.platinum ?? '—'} />
        <StatCard icon={Clock3} label="Pending Requests" value={stats.data?.pending ?? '—'} sub="From the website form" />
      </div>

      <div className="fan-contestants__filters" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        {[
          ['', 'All'],
          ['PENDING', 'Pending'],
          ['ACTIVE', 'Active'],
          ['INACTIVE', 'Hidden'],
        ].map(([v, l]) => (
          <button key={v} type="button" className={`btn ${filter === v ? 'btn--gold' : 'btn--outline'}`} style={small} onClick={() => setFilter(v)}>
            {l}
          </button>
        ))}
      </div>

      <DataTable
        emptyLabel={loading ? 'Loading…' : 'No sponsors here.'}
        columns={[
          {
            key: 'name',
            label: 'Sponsor',
            render: (row) => (
              <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 32, height: 32, borderRadius: 6, background: '#2a2620', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', fontSize: '0.7rem', fontWeight: 700, color: '#f0a93a', flexShrink: 0 }}>
                  {row.raw.logo ? <img src={row.raw.logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fff' }} /> : initialsOf(row.name)}
                </span>
                {row.name}
              </span>
            ),
          },
          { key: 'tier', label: 'Tier', render: (row) => <Badge tone={TIER_TONE[row.tier]}>{titleCase(row.tier)}</Badge> },
          { key: 'contact', label: 'Contact' },
          { key: 'status', label: 'Status', render: (row) => <Badge tone={STATUS_TONE[row.status]}>{row.status === 'INACTIVE' ? 'Hidden' : titleCase(row.status)}</Badge> },
          {
            key: 'actions',
            label: 'Actions',
            render: (row) => (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <button type="button" className="btn btn--outline" style={small} onClick={() => setViewing(row.raw)}>
                  View
                </button>
                {isAdmin && row.status !== 'ACTIVE' && (
                  <button
                    type="button"
                    className="btn btn--gold"
                    style={small}
                    onClick={() => run(() => api(`/admin/sponsors/${row.id}/status`, { method: 'PATCH', body: { status: 'ACTIVE' } }))}
                  >
                    <CheckCircle2 size={14} /> {row.status === 'PENDING' ? 'Approve' : 'Show'}
                  </button>
                )}
                {isAdmin && row.status === 'ACTIVE' && (
                  <button
                    type="button"
                    className="btn btn--outline"
                    style={small}
                    onClick={() => run(() => api(`/admin/sponsors/${row.id}/status`, { method: 'PATCH', body: { status: 'INACTIVE' } }))}
                  >
                    <EyeOff size={14} /> Hide
                  </button>
                )}
                {isAdmin && (
                  <>
                    <button type="button" className="btn btn--outline" style={small} onClick={() => openForm(row.raw)} aria-label="Edit">
                      <Pencil size={14} />
                    </button>
                    <button type="button" className="btn btn--outline" style={small} onClick={() => uploadLogo(row.raw)} aria-label="Upload logo">
                      <Upload size={14} />
                    </button>
                    <button
                      type="button"
                      className="btn btn--outline"
                      style={small}
                      aria-label="Delete"
                      onClick={() => window.confirm(`Delete ${row.name}?`) && run(() => api(`/admin/sponsors/${row.id}`, { method: 'DELETE' }))}
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
              </div>
            ),
          },
        ]}
        rows={rows}
      />

      <Modal isOpen={Boolean(viewing)} title={viewing?.companyName ?? ''} onClose={() => setViewing(null)}>
        {viewing && (
          <div style={{ display: 'grid', gap: 8, fontSize: '0.88rem' }}>
            <p><strong>Tier:</strong> {titleCase(viewing.packageType)} · <strong>Status:</strong> {titleCase(viewing.status)}</p>
            <p><strong>Contact:</strong> {viewing.contactName || '—'} · {viewing.contactEmail}{viewing.contactPhone ? ` · ${viewing.contactPhone}` : ''}</p>
            <p><strong>Website:</strong> {viewing.website ? <a href={viewing.website} target="_blank" rel="noreferrer" style={{ color: '#f0a93a' }}>{viewing.website}</a> : '—'}</p>
            {viewing.message && (
              <p style={{ whiteSpace: 'pre-line' }}>
                <strong>Message:</strong> {viewing.message}
              </p>
            )}
            <p style={{ color: '#a8a49b' }}>Received {formatDate(viewing.createdAt)}</p>
          </div>
        )}
      </Modal>

      <Modal isOpen={Boolean(editing)} title={editing === 'new' ? 'Add Sponsor' : 'Edit Sponsor'} onClose={() => setEditing(null)}>
        <form className="auth-form" onSubmit={save} noValidate>
          <Notice tone="error">{formError}</Notice>
          <Field id="sp-name" label="Company name" icon={Handshake} error={errors.companyName}>
            <input id="sp-name" type="text" placeholder="e.g. Inyange Industries" value={form.companyName} onChange={update('companyName')} />
          </Field>
          <div className="auth-form__row">
            <Field id="sp-tier" label="Tier" icon={Award} error={errors.packageType} select>
              <select id="sp-tier" value={form.packageType} onChange={update('packageType')}>
                {TIERS.map((t) => (
                  <option key={t} value={t}>
                    {titleCase(t)}
                  </option>
                ))}
              </select>
            </Field>
            <Field id="sp-web" label="Website (optional)" icon={Globe} error={errors.website}>
              <input id="sp-web" type="text" placeholder="company.rw" value={form.website} onChange={update('website')} />
            </Field>
          </div>
          <Field id="sp-contact" label="Contact email" icon={Mail} error={errors.contactEmail}>
            <input id="sp-contact" type="email" placeholder="contact@company.rw" value={form.contactEmail} onChange={update('contactEmail')} />
          </Field>
          <div className="auth-form__row">
            <Field id="sp-person" label="Contact person (optional)" icon={User} error={errors.contactName}>
              <input id="sp-person" type="text" value={form.contactName} onChange={update('contactName')} />
            </Field>
            <Field id="sp-phone" label="Phone (optional)" icon={Phone} error={errors.contactPhone}>
              <input id="sp-phone" type="tel" value={form.contactPhone} onChange={update('contactPhone')} />
            </Field>
          </div>
          <button type="submit" className="btn btn--gold auth-form__submit" disabled={saving}>
            {saving ? 'Saving…' : editing === 'new' ? 'Add Sponsor' : 'Save Changes'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
