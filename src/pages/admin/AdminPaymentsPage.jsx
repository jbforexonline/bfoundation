import { useEffect, useState } from 'react';
import { Wallet, CheckCircle2, XCircle, Clock3, Plus, User, CreditCard, Search, FileText } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Field from '../../components/ui/Field';
import Notice from '../../components/ui/Notice';
import useApi from '../../hooks/useApi';
import { usePaymentConfig } from '../../api/payments';
import { api, formatDateTime, formatNumber, titleCase } from '../../api/client';
import { useAuth } from '../../auth/AuthContext';
import '../../components/dashboard/DashboardPage.scss';
import '../../components/auth/AuthForm.scss';

const TONE = { SUCCESSFUL: 'success', PENDING: 'warning', FAILED: 'danger' };
const PURPOSE = { VOTE_PURCHASE: 'Votes', TICKET_ORDER: 'Tickets', NOMINATION_SUPPORT: 'Nomination support', MANUAL: 'Manual' };
const METHODS = ['MTN MoMo', 'Airtel Money', 'Cash', 'Bank transfer', 'Visa Card', 'Mastercard', 'International Card'];
const EMPTY_FORM = { userEmail: '', amount: '', method: 'Cash', note: '' };
const rwf = (n) => `${formatNumber(n)} RWF`;
const small = { padding: '6px 12px', fontSize: '0.78rem' };

// Every payment that went through Paypack (or the test simulator), plus money recorded by hand.
export default function AdminPaymentsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const payConfig = usePaymentConfig();
  const [status, setStatus] = useState('');
  const [purpose, setPurpose] = useState('');
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setSearch(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  const list = useApi('/admin/payments', { limit: 100, status: status || undefined, purpose: purpose || undefined, search: search || undefined });
  const stats = useApi('/admin/payments/stats');
  const [notice, setNotice] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleAdd = async (e) => {
    e.preventDefault();
    setErrors({});
    setFormError('');
    try {
      const d = await api('/admin/payments/manual', {
        method: 'POST',
        body: { ...form, userEmail: form.userEmail || undefined, amount: Number(form.amount) },
      });
      setNotice({ tone: 'success', text: d._message });
      setForm(EMPTY_FORM);
      setModalOpen(false);
      list.reload();
      stats.reload();
    } catch (err) {
      setErrors(err.fieldErrors);
      setFormError(err.message);
    }
  };

  const s = stats.data;
  const rows = (list.data?.payments ?? []).map((p) => ({ id: p.id, raw: p }));
  const modeText = { live: 'Live — real Paypack payments', test: 'Test mode — simulated, no real money', off: 'Off — pay buttons are hidden' };

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Payments</h1>
          <p className="dash-page__subtitle">
            Mobile Money payments through Paypack for votes and tickets.{' '}
            {payConfig && <Badge tone={payConfig.mode === 'live' ? 'success' : payConfig.mode === 'test' ? 'warning' : 'neutral'}>{modeText[payConfig.mode]}</Badge>}
          </p>
        </div>
        {isAdmin && (
          <button type="button" className="btn btn--gold" onClick={() => { setModalOpen(true); setErrors({}); setFormError(''); }}>
            <Plus size={16} /> Record Payment
          </button>
        )}
      </div>

      <Notice tone={notice?.tone}>{notice?.text}</Notice>
      <Notice tone="error">{list.error?.message || stats.error?.message}</Notice>

      <div className="dash-page__stats" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <StatCard icon={Wallet} label="Total Revenue" value={s ? rwf(s.totalRevenue) : '—'} sub={s ? Object.entries(s.revenueByPurpose).map(([k, v]) => `${PURPOSE[k] ?? k}: ${rwf(v)}`).join(' · ') || 'No payments yet' : undefined} />
        <StatCard icon={CheckCircle2} label="Successful" value={s?.successful ?? '—'} sub={s ? Object.entries(s.revenueByChannel).map(([k, v]) => `${k}: ${rwf(v)}`).join(' · ') : undefined} />
        <StatCard icon={Clock3} label="Pending" value={s?.pending ?? '—'} sub="Waiting for the payer to approve" />
        <StatCard icon={XCircle} label="Failed" value={s?.failed ?? '—'} sub="Declined, expired or refused" />
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12, alignItems: 'center' }}>
        {[
          ['', 'All'],
          ['SUCCESSFUL', 'Successful'],
          ['PENDING', 'Pending'],
          ['FAILED', 'Failed'],
        ].map(([v, l]) => (
          <button key={v} type="button" className={`btn ${status === v ? 'btn--gold' : 'btn--outline'}`} style={small} onClick={() => setStatus(v)}>
            {l}
          </button>
        ))}
        <select
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          aria-label="Filter by purpose"
          style={{ background: '#16130d', color: '#e9e6df', border: '1px solid #2e2a22', borderRadius: 8, padding: '6px 10px', fontSize: '0.8rem' }}
        >
          <option value="">All purposes</option>
          {Object.entries(PURPOSE).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <div className="data-table__search" style={{ marginLeft: 'auto', maxWidth: 280, marginBottom: 0 }}>
          <Search size={16} />
          <input type="text" placeholder="Name, email, phone or Paypack ref…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>

      <DataTable
        searchable={false}
        emptyLabel={list.loading ? 'Loading…' : 'No payments yet.'}
        columns={[
          { key: 'date', label: 'Date', render: (row) => formatDateTime(row.raw.createdAt) },
          { key: 'user', label: 'Payer', render: (row) => row.raw.user?.name ?? '—' },
          { key: 'for', label: 'For', render: (row) => PURPOSE[row.raw.purpose] ?? row.raw.purpose },
          { key: 'amount', label: 'Amount', render: (row) => rwf(row.raw.amount) },
          { key: 'method', label: 'Method', render: (row) => `${row.raw.method}${row.raw.phone ? ` · ${row.raw.phone}` : ''}` },
          {
            key: 'ref',
            label: 'Reference',
            render: (row) => (
              <span style={{ fontSize: '0.75rem' }}>
                {row.raw.provider === 'SIMULATION' ? 'test' : row.raw.providerRef ?? (row.raw.recordedBy ? `by ${row.raw.recordedBy.name}` : '—')}
              </span>
            ),
          },
          {
            key: 'status',
            label: 'Status',
            render: (row) => (
              <span title={row.raw.failureReason ?? ''}>
                <Badge tone={TONE[row.raw.status]}>{titleCase(row.raw.status)}</Badge>
              </span>
            ),
          },
        ]}
        rows={rows}
      />

      <Modal isOpen={isModalOpen} title="Record a payment received outside the website" onClose={() => setModalOpen(false)}>
        <form className="auth-form" onSubmit={handleAdd} noValidate>
          <Notice tone="error">{formError}</Notice>
          <p style={{ color: '#a8a49b', fontSize: '0.82rem' }}>
            For the books only (cash at an event, bank transfer from a sponsor…). It does not add votes or tickets.
          </p>
          <Field id="pay-user" label="Payer's account email (optional)" icon={User} error={errors.userEmail}>
            <input id="pay-user" type="email" value={form.userEmail} onChange={update('userEmail')} />
          </Field>
          <div className="auth-form__row">
            <Field id="pay-amount" label="Amount (RWF)" icon={Wallet} error={errors.amount}>
              <input id="pay-amount" type="number" min="1" placeholder="e.g. 50000" value={form.amount} onChange={update('amount')} />
            </Field>
            <Field id="pay-method" label="Method" icon={CreditCard} error={errors.method} select>
              <select id="pay-method" value={form.method} onChange={update('method')}>
                {METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field id="pay-note" label="What was it for?" icon={FileText} error={errors.note}>
            <input id="pay-note" type="text" placeholder="e.g. Gala door sales" value={form.note} onChange={update('note')} />
          </Field>
          <button type="submit" className="btn btn--gold auth-form__submit">
            Record Payment
          </button>
        </form>
      </Modal>
    </div>
  );
}
