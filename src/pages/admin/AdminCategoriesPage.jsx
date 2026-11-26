import { useState } from 'react';
import { LayoutGrid, CheckCircle2, Wallet, Ban, Plus, Award, FileText } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Field from '../../components/ui/Field';
import Notice from '../../components/ui/Notice';
import useApi from '../../hooks/useApi';
import { api, formatRwf } from '../../api/client';
import { useAuth } from '../../auth/AuthContext';
import '../../components/dashboard/DashboardPage.scss';
import '../../components/auth/AuthForm.scss';

const EMPTY_FORM = { name: '', prize: '3,000,000 RWF', description: '' };

const shortRwf = (n) => (n >= 1_000_000 ? `${Math.round((n / 1_000_000) * 10) / 10}M RWF` : formatRwf(n));

export default function AdminCategoriesPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const { data, error, loading, reload } = useApi('/admin/categories');
  const [isModalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [notice, setNotice] = useState(null);

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const toggleStatus = async (row) => {
    setNotice(null);
    try {
      const res = await api(`/admin/categories/${row.id}/status`, { method: 'PATCH', body: { isActive: !row.isActive } });
      setNotice({ tone: 'success', text: res._message });
      reload();
    } catch (err) {
      setNotice({ tone: 'error', text: err.message });
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setErrors({});
    setFormError('');
    try {
      await api('/admin/categories', {
        method: 'POST',
        body: { name: form.name, prizeAmount: form.prize, description: form.description || undefined },
      });
      setModalOpen(false);
      setForm(EMPTY_FORM);
      setNotice({ tone: 'success', text: `Category "${form.name}" created.` });
      reload();
    } catch (err) {
      setErrors(err.fieldErrors);
      setFormError(err.message);
    }
  };

  const rows = (data?.categories ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    contestants: c.contestantCount,
    prize: formatRwf(c.prizeAmount),
    isActive: c.isActive,
  }));
  const stats = data?.stats;

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Categories</h1>
          <p className="dash-page__subtitle">Manage the award categories running on the platform.</p>
        </div>
        {isAdmin && (
          <button type="button" className="btn btn--gold" onClick={() => setModalOpen(true)}>
            <Plus size={16} /> Add Category
          </button>
        )}
      </div>

      <Notice tone={notice?.tone}>{notice?.text}</Notice>
      <Notice tone="error">{error?.message}</Notice>

      <div className="dash-page__stats">
        <StatCard icon={LayoutGrid} label="Total Categories" value={stats?.total ?? '—'} />
        <StatCard icon={CheckCircle2} label="Active" value={stats?.active ?? '—'} />
        <StatCard icon={Wallet} label="Total Prize Pool" value={stats ? shortRwf(stats.totalPrizePool) : '—'} />
      </div>

      <DataTable
        emptyLabel={loading ? 'Loading…' : 'No categories.'}
        columns={[
          { key: 'name', label: 'Category' },
          { key: 'contestants', label: 'Contestants' },
          { key: 'prize', label: 'Prize' },
          {
            key: 'status',
            label: 'Status',
            render: (row) => <Badge tone={row.isActive ? 'success' : 'neutral'}>{row.isActive ? 'Active' : 'Inactive'}</Badge>,
          },
          ...(isAdmin
            ? [
                {
                  key: 'actions',
                  label: 'Actions',
                  render: (row) => (
                    <button
                      type="button"
                      className={`btn ${row.isActive ? 'btn--outline' : 'btn--gold'}`}
                      style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                      onClick={() => toggleStatus(row)}
                    >
                      {row.isActive ? (
                        <>
                          <Ban size={14} /> Deactivate
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={14} /> Activate
                        </>
                      )}
                    </button>
                  ),
                },
              ]
            : []),
        ]}
        rows={rows}
      />

      <Modal isOpen={isModalOpen} title="Add Category" onClose={() => setModalOpen(false)}>
        <Notice tone="error">{formError}</Notice>
        <form className="auth-form" onSubmit={handleAdd} noValidate>
          <Field id="cat-name" label="Category name" icon={Award} error={errors.name}>
            <input id="cat-name" type="text" placeholder="e.g. Best Podcaster" value={form.name} onChange={update('name')} />
          </Field>
          <Field id="cat-prize" label="Prize" icon={FileText} error={errors.prizeAmount}>
            <input id="cat-prize" type="text" value={form.prize} onChange={update('prize')} />
          </Field>
          <Field id="cat-desc" label="Short description (optional)" icon={FileText} error={errors.description}>
            <input id="cat-desc" type="text" value={form.description} onChange={update('description')} />
          </Field>
          <button type="submit" className="btn btn--gold auth-form__submit">
            Add Category
          </button>
        </form>
      </Modal>
    </div>
  );
}
