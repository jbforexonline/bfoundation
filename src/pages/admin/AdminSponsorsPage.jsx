import { useState } from 'react';
import { Handshake, Award, Clock3, CheckCircle2, Plus, Mail } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import '../../components/dashboard/DashboardPage.scss';
import '../../components/auth/AuthForm.scss';

const INITIAL_SPONSORS = [
  { id: 1, name: 'MTN Rwanda', tier: 'Platinum', contact: 'partnerships@mtn.rw', status: 'Active' },
  { id: 2, name: 'Bank of Kigali', tier: 'Platinum', contact: 'brand@bk.rw', status: 'Active' },
  { id: 3, name: 'Skol Brewery', tier: 'Gold', contact: 'marketing@skol.rw', status: 'Active' },
  { id: 4, name: 'Airtel Rwanda', tier: 'Gold', contact: 'sponsorship@airtel.rw', status: 'Active' },
  { id: 5, name: 'Question Coffee', tier: 'Silver', contact: 'hello@questioncoffee.rw', status: 'Pending' },
  { id: 6, name: 'Zipline Rwanda', tier: 'Silver', contact: 'community@zipline.rw', status: 'Pending' },
];

const TIER_TONE = { Platinum: 'neutral', Gold: 'gold', Silver: 'neutral' };
const TIERS = ['Platinum', 'Gold', 'Silver'];
const EMPTY_FORM = { name: '', tier: 'Silver', contact: '' };

export default function AdminSponsorsPage() {
  const [sponsors, setSponsors] = useState(INITIAL_SPONSORS);
  const [isModalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const approve = (id) => {
    setSponsors((prev) => prev.map((s) => (s.id === id ? { ...s, status: 'Active' } : s)));
    // TODO: call your real "approve sponsor" endpoint here.
  };

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.contact.trim()) return;
    // TODO: call your real "create sponsor" endpoint here.
    setSponsors((prev) => [
      { id: Date.now(), name: form.name, tier: form.tier, contact: form.contact, status: 'Active' },
      ...prev,
    ]);
    setForm(EMPTY_FORM);
    setModalOpen(false);
  };

  const pendingCount = sponsors.filter((s) => s.status === 'Pending').length;
  const platinumCount = sponsors.filter((s) => s.tier === 'Platinum').length;

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Sponsors</h1>
          <p className="dash-page__subtitle">Manage partner tiers and pending sponsorship requests.</p>
        </div>
        <button type="button" className="btn btn--gold" onClick={() => setModalOpen(true)}>
          <Plus size={16} /> Add Sponsor
        </button>
      </div>

      <div className="dash-page__stats">
        <StatCard icon={Handshake} label="Total Sponsors" value={sponsors.length} />
        <StatCard icon={Award} label="Platinum Partners" value={platinumCount} />
        <StatCard icon={Clock3} label="Pending Requests" value={pendingCount} />
      </div>

      <DataTable
        columns={[
          { key: 'name', label: 'Sponsor' },
          { key: 'tier', label: 'Tier', render: (row) => <Badge tone={TIER_TONE[row.tier]}>{row.tier}</Badge> },
          { key: 'contact', label: 'Contact' },
          {
            key: 'status',
            label: 'Status',
            render: (row) => <Badge tone={row.status === 'Active' ? 'success' : 'warning'}>{row.status}</Badge>,
          },
          {
            key: 'actions',
            label: 'Actions',
            render: (row) =>
              row.status === 'Pending' ? (
                <button
                  type="button"
                  className="btn btn--gold"
                  style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                  onClick={() => approve(row.id)}
                >
                  <CheckCircle2 size={14} /> Approve
                </button>
              ) : (
                <span style={{ color: '#78746c', fontSize: '0.8rem' }}>—</span>
              ),
          },
        ]}
        rows={sponsors}
      />

      <Modal isOpen={isModalOpen} title="Add Sponsor" onClose={() => setModalOpen(false)}>
        <form className="auth-form" onSubmit={handleAdd} noValidate>
          <div className="auth-form__field">
            <label htmlFor="sp-name">Sponsor name</label>
            <div className="auth-form__input-wrap">
              <Handshake size={16} />
              <input id="sp-name" type="text" placeholder="e.g. Inyange Industries" value={form.name} onChange={update('name')} />
            </div>
          </div>

          <div className="auth-form__field">
            <label htmlFor="sp-tier">Tier</label>
            <div className="auth-form__input-wrap auth-form__input-wrap--select">
              <Award size={16} />
              <select id="sp-tier" value={form.tier} onChange={update('tier')}>
                {TIERS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="auth-form__field">
            <label htmlFor="sp-contact">Contact email</label>
            <div className="auth-form__input-wrap">
              <Mail size={16} />
              <input id="sp-contact" type="email" placeholder="contact@company.rw" value={form.contact} onChange={update('contact')} />
            </div>
          </div>

          <button type="submit" className="btn btn--gold auth-form__submit">Add Sponsor</button>
        </form>
      </Modal>
    </div>
  );
}
