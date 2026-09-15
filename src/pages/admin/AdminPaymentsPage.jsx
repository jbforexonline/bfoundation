import { useState } from 'react';
import { Wallet, CheckCircle2, XCircle, Clock3, Plus, User, CreditCard } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import '../../components/dashboard/DashboardPage.scss';
import '../../components/auth/AuthForm.scss';

const INITIAL_PAYMENTS = [
  { id: 'TXN-90231', user: 'Joyce Uwase', amount: '4,000 RWF', method: 'MTN MoMo', status: 'Paid' },
  { id: 'TXN-90230', user: 'Eric Niyonzima', amount: '1,000 RWF', method: 'Airtel Money', status: 'Paid' },
  { id: 'TXN-90229', user: 'Aline Mutesi', amount: '7,000 RWF', method: 'Visa Card', status: 'Paid' },
  { id: 'TXN-90228', user: 'Patrick Habimana', amount: '4,000 RWF', method: 'MTN MoMo', status: 'Pending' },
  { id: 'TXN-90227', user: 'Christelle Uwase', amount: '1,000 RWF', method: 'Airtel Money', status: 'Failed' },
  { id: 'TXN-90226', user: 'Samuel Bizimana', amount: '7,000 RWF', method: 'MTN MoMo', status: 'Paid' },
];

const TONE = { Paid: 'success', Pending: 'warning', Failed: 'danger' };
const METHODS = ['MTN MoMo', 'Airtel Money', 'Visa Card', 'Mastercard', 'International Card'];
const EMPTY_FORM = { user: '', amount: '', method: METHODS[0] };

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState(INITIAL_PAYMENTS);
  const [isModalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.user.trim() || !form.amount.trim()) return;
    // TODO: call your real "record payment" endpoint here (this is for manual/admin adjustments only).
    setPayments((prev) => [
      {
        id: `TXN-${Math.floor(10000 + Math.random() * 89999)}`,
        user: form.user,
        amount: form.amount,
        method: form.method,
        status: 'Paid',
      },
      ...prev,
    ]);
    setForm(EMPTY_FORM);
    setModalOpen(false);
  };

  const paidCount = payments.filter((p) => p.status === 'Paid').length;
  const failedCount = payments.filter((p) => p.status === 'Failed').length;

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Payments</h1>
          <p className="dash-page__subtitle">Vote package purchases and their transaction status.</p>
        </div>
        <button type="button" className="btn btn--gold" onClick={() => setModalOpen(true)}>
          <Plus size={16} /> Add Payment
        </button>
      </div>

      <div className="dash-page__stats">
        <StatCard icon={Wallet} label="Total Revenue" value="86.4M RWF" sub="All time" />
        <StatCard icon={CheckCircle2} label="Successful" value={paidCount} />
        <StatCard icon={XCircle} label="Failed" value={failedCount} />
      </div>

      <DataTable
        columns={[
          { key: 'id', label: 'Transaction ID' },
          { key: 'user', label: 'User' },
          { key: 'amount', label: 'Amount' },
          { key: 'method', label: 'Method' },
          {
            key: 'status',
            label: 'Status',
            render: (row) => (
              <Badge tone={TONE[row.status] ?? 'neutral'}>
                {row.status === 'Pending' && <Clock3 size={11} style={{ marginRight: 4, verticalAlign: -1 }} />}
                {row.status}
              </Badge>
            ),
          },
        ]}
        rows={payments}
      />

      <Modal isOpen={isModalOpen} title="Add Payment" onClose={() => setModalOpen(false)}>
        <form className="auth-form" onSubmit={handleAdd} noValidate>
          <div className="auth-form__field">
            <label htmlFor="pay-user">User</label>
            <div className="auth-form__input-wrap">
              <User size={16} />
              <input id="pay-user" type="text" placeholder="Full name" value={form.user} onChange={update('user')} />
            </div>
          </div>

          <div className="auth-form__field">
            <label htmlFor="pay-amount">Amount</label>
            <div className="auth-form__input-wrap">
              <Wallet size={16} />
              <input
                id="pay-amount"
                type="text"
                placeholder="e.g. 4,000 RWF"
                value={form.amount}
                onChange={update('amount')}
              />
            </div>
          </div>

          <div className="auth-form__field">
            <label htmlFor="pay-method">Method</label>
            <div className="auth-form__input-wrap auth-form__input-wrap--select">
              <CreditCard size={16} />
              <select id="pay-method" value={form.method} onChange={update('method')}>
                {METHODS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn--gold auth-form__submit">Add Payment</button>
        </form>
      </Modal>
    </div>
  );
}
