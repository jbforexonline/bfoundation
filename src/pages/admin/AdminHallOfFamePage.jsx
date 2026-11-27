import { useState } from 'react';
import { Trophy, Plus, Calendar, User, LayoutGrid, Pencil, Trash2, Upload, Award } from 'lucide-react';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Field from '../../components/ui/Field';
import Notice from '../../components/ui/Notice';
import useApi from '../../hooks/useApi';
import { api, initialsOf } from '../../api/client';
import { useAuth } from '../../auth/AuthContext';
import '../../components/auth/AuthForm.scss';
import '../../components/dashboard/DashboardPage.scss';

const THIS_YEAR = new Date().getFullYear();
const EMPTY = { year: THIS_YEAR, name: '', category: '', featured: false, rank: '' };
const small = { padding: '6px 12px', fontSize: '0.78rem' };

// Past winners shown on the Hall of Fame page; the 3 featured winners of the latest year are on the home page.
export default function AdminHallOfFamePage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const [year, setYear] = useState('');
  const { data, error, loading, reload } = useApi('/admin/hall-of-fame', { year: year || undefined });
  const categories = useApi('/categories');
  const [notice, setNotice] = useState(null);
  const [editing, setEditing] = useState(null); // 'new' | entry
  const [recordOpen, setRecordOpen] = useState(false);
  const [recordYear, setRecordYear] = useState(THIS_YEAR);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const openForm = (entry) => {
    setEditing(entry ?? 'new');
    setForm(entry ? { year: entry.year, name: entry.name, category: entry.category, featured: entry.featured, rank: entry.rank ?? '' } : EMPTY);
    setErrors({});
    setFormError('');
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setFormError('');
    const body = { ...form, rank: form.featured && form.rank ? Number(form.rank) : null };
    try {
      const d =
        editing === 'new'
          ? await api('/admin/hall-of-fame', { method: 'POST', body })
          : await api(`/admin/hall-of-fame/${editing.id}`, { method: 'PATCH', body });
      setNotice({ tone: 'success', text: d._message });
      setEditing(null);
      reload();
    } catch (err) {
      setErrors(err.fieldErrors);
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const record = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      const d = await api('/admin/hall-of-fame/record-winners', { method: 'POST', body: { year: Number(recordYear) } });
      const extra = [
        d.skipped.length ? `${d.skipped.length} category(ies) already had a ${d.year} winner` : '',
        d.categoriesWithoutVotes.length ? `no votes yet in: ${d.categoriesWithoutVotes.join(', ')}` : '',
      ]
        .filter(Boolean)
        .join('; ');
      setNotice({ tone: d.created.length ? 'success' : 'info', text: `${d._message}${extra ? ` (${extra})` : ''}` });
      setRecordOpen(false);
      setYear(String(d.year));
      reload();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const run = async (fn) => {
    setNotice(null);
    try {
      const d = await fn();
      setNotice({ tone: 'success', text: d._message });
      reload();
    } catch (err) {
      setNotice({ tone: 'error', text: err.message });
    }
  };

  const uploadPhoto = (entry) => {
    const input = Object.assign(document.createElement('input'), { type: 'file', accept: 'image/png,image/jpeg,image/webp' });
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('photo', file);
      run(() => api(`/admin/hall-of-fame/${entry.id}/photo`, { method: 'POST', form: formData }));
    };
    input.click();
  };

  const entries = data?.entries ?? [];
  const rows = entries.map((e) => ({ id: e.id, year: e.year, name: e.name, category: e.category, raw: e }));

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Hall of Fame</h1>
          <p className="dash-page__subtitle">Past winners on the Hall of Fame page. The latest year’s featured winners appear on the home page.</p>
        </div>
        {isAdmin && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button type="button" className="btn btn--outline" onClick={() => { setRecordOpen(true); setFormError(''); }}>
              <Award size={16} /> Record winners
            </button>
            <button type="button" className="btn btn--gold" onClick={() => openForm(null)}>
              <Plus size={16} /> Add Winner
            </button>
          </div>
        )}
      </div>

      <Notice tone={notice?.tone}>{notice?.text}</Notice>
      <Notice tone="error">{error?.message}</Notice>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        {['', ...(data?.years ?? []).map(String)].map((y) => (
          <button key={y} type="button" className={`btn ${year === y ? 'btn--gold' : 'btn--outline'}`} style={small} onClick={() => setYear(y)}>
            {y || 'All years'}
          </button>
        ))}
      </div>

      <DataTable
        emptyLabel={loading ? 'Loading…' : 'No winners yet.'}
        columns={[
          { key: 'year', label: 'Year' },
          {
            key: 'name',
            label: 'Winner',
            render: (row) => (
              <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 32, height: 32, borderRadius: '50%', background: '#2a2620', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', fontSize: '0.7rem', fontWeight: 700, color: '#f0a93a', flexShrink: 0 }}>
                  {row.raw.photo ? <img src={row.raw.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initialsOf(row.name)}
                </span>
                {row.name}
              </span>
            ),
          },
          { key: 'category', label: 'Category' },
          {
            key: 'featured',
            label: 'Home podium',
            render: (row) => (row.raw.featured ? <Badge tone="gold"><Trophy size={11} style={{ marginRight: 4, verticalAlign: -1 }} />#{row.raw.rank ?? '–'}</Badge> : '—'),
          },
          {
            key: 'actions',
            label: 'Actions',
            render: (row) =>
              isAdmin ? (
                <div style={{ display: 'flex', gap: 6 }}>
                  <button type="button" className="btn btn--outline" style={small} onClick={() => openForm(row.raw)} aria-label="Edit">
                    <Pencil size={14} />
                  </button>
                  <button type="button" className="btn btn--outline" style={small} onClick={() => uploadPhoto(row.raw)} aria-label="Upload photo">
                    <Upload size={14} />
                  </button>
                  <button
                    type="button"
                    className="btn btn--outline"
                    style={small}
                    aria-label="Delete"
                    onClick={() => window.confirm(`Remove ${row.name} (${row.year})?`) && run(() => api(`/admin/hall-of-fame/${row.id}`, { method: 'DELETE' }))}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ) : (
                '—'
              ),
          },
        ]}
        rows={rows}
      />

      <Modal isOpen={Boolean(editing)} title={editing === 'new' ? 'Add Winner' : 'Edit Winner'} onClose={() => setEditing(null)}>
        <form className="auth-form" onSubmit={save} noValidate>
          <Notice tone="error">{formError}</Notice>
          <div className="auth-form__row">
            <Field id="hof-year" label="Year" icon={Calendar} error={errors.year}>
              <input id="hof-year" type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
            </Field>
            <Field id="hof-cat" label="Category" icon={LayoutGrid} error={errors.category}>
              <input
                id="hof-cat"
                type="text"
                list="hof-cat-list"
                placeholder="e.g. Best Musician"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
              <datalist id="hof-cat-list">
                {(categories.data?.categories ?? []).map((c) => (
                  <option key={c.id} value={c.name} />
                ))}
              </datalist>
            </Field>
          </div>
          <Field id="hof-name" label="Winner name" icon={User} error={errors.name}>
            <input id="hof-name" type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <div className="auth-form__row" style={{ alignItems: 'center' }}>
            <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.85rem' }}>
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
              Feature on the home page podium
            </label>
            {form.featured && (
              <Field id="hof-rank" label="Podium place" icon={Trophy} error={errors.rank} select>
                <select id="hof-rank" value={form.rank} onChange={(e) => setForm({ ...form, rank: e.target.value })}>
                  <option value="">—</option>
                  <option value="1">1st</option>
                  <option value="2">2nd</option>
                  <option value="3">3rd</option>
                </select>
              </Field>
            )}
          </div>
          <button type="submit" className="btn btn--gold auth-form__submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </form>
      </Modal>

      <Modal isOpen={recordOpen} title="Record this competition’s winners" onClose={() => setRecordOpen(false)}>
        <form className="auth-form" onSubmit={record} noValidate>
          <Notice tone="error">{formError}</Notice>
          <p style={{ color: '#a8a49b', fontSize: '0.85rem' }}>
            For every active category, the contestant with the most votes is added as that year’s winner (with their profile photo).
            The three with the most votes are featured on the home page. Categories that already have a winner for that year are skipped.
          </p>
          <Field id="rec-year" label="Year" icon={Calendar}>
            <input id="rec-year" type="number" value={recordYear} onChange={(e) => setRecordYear(e.target.value)} />
          </Field>
          <button type="submit" className="btn btn--gold auth-form__submit" disabled={saving}>
            {saving ? 'Recording…' : 'Record winners'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
