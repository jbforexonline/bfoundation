import { useState } from 'react';
import { LayoutGrid, CheckCircle2, Wallet, Ban, Plus, Award, FileText } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import '../../components/dashboard/DashboardPage.scss';
import '../../components/auth/AuthForm.scss';

const INITIAL_CATEGORIES = [
  { id: 1, name: 'Best TikToker', contestants: 142, prize: '3,000,000 RWF', status: 'Active' },
  { id: 2, name: 'Best YouTuber', contestants: 98, prize: '3,000,000 RWF', status: 'Active' },
  { id: 3, name: 'Best Musician', contestants: 176, prize: '3,000,000 RWF', status: 'Active' },
  { id: 4, name: 'Best Comedian', contestants: 64, prize: '3,000,000 RWF', status: 'Active' },
  { id: 5, name: 'Best Journalist', contestants: 51, prize: '3,000,000 RWF', status: 'Active' },
  { id: 6, name: 'Best Influencer', contestants: 130, prize: '3,000,000 RWF', status: 'Active' },
  { id: 7, name: 'Best Footballer', contestants: 88, prize: '3,000,000 RWF', status: 'Active' },
  { id: 8, name: 'Best Dancer', contestants: 47, prize: '3,000,000 RWF', status: 'Inactive' },
  { id: 9, name: 'Best DJ', contestants: 39, prize: '3,000,000 RWF', status: 'Inactive' },
  { id: 10, name: 'Best Actor', contestants: 42, prize: '3,000,000 RWF', status: 'Active' },
  { id: 11, name: 'Entrepreneur', contestants: 73, prize: '3,000,000 RWF', status: 'Active' },
];

const EMPTY_FORM = { name: '', prize: '3,000,000 RWF' };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [isModalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const toggleStatus = (id) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' } : c
      )
    );
    // TODO: call your real "update category status" endpoint here.
  };

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    // TODO: call your real "create category" endpoint here.
    setCategories((prev) => [
      { id: Date.now(), name: form.name, contestants: 0, prize: form.prize, status: 'Active' },
      ...prev,
    ]);
    setForm(EMPTY_FORM);
    setModalOpen(false);
  };

  const activeCount = categories.filter((c) => c.status === 'Active').length;

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Categories</h1>
          <p className="dash-page__subtitle">Manage the award categories running on the platform.</p>
        </div>
        <button type="button" className="btn btn--gold" onClick={() => setModalOpen(true)}>
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div className="dash-page__stats">
        <StatCard icon={LayoutGrid} label="Total Categories" value={categories.length} />
        <StatCard icon={CheckCircle2} label="Active" value={activeCount} />
        <StatCard icon={Wallet} label="Total Prize Pool" value="33M RWF" />
      </div>

      <DataTable
        columns={[
          { key: 'name', label: 'Category' },
          { key: 'contestants', label: 'Contestants' },
          { key: 'prize', label: 'Prize' },
          {
            key: 'status',
            label: 'Status',
            render: (row) => <Badge tone={row.status === 'Active' ? 'success' : 'neutral'}>{row.status}</Badge>,
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
        ]}
        rows={categories}
      />

      <Modal isOpen={isModalOpen} title="Add Category" onClose={() => setModalOpen(false)}>
        <form className="auth-form" onSubmit={handleAdd} noValidate>
          <div className="auth-form__field">
            <label htmlFor="cat-name">Category name</label>
            <div className="auth-form__input-wrap">
              <Award size={16} />
              <input id="cat-name" type="text" placeholder="e.g. Best Podcaster" value={form.name} onChange={update('name')} />
            </div>
          </div>

          <div className="auth-form__field">
            <label htmlFor="cat-prize">Prize</label>
            <div className="auth-form__input-wrap">
              <FileText size={16} />
              <input id="cat-prize" type="text" value={form.prize} onChange={update('prize')} />
            </div>
          </div>

          <button type="submit" className="btn btn--gold auth-form__submit">Add Category</button>
        </form>
      </Modal>
    </div>
  );
}
