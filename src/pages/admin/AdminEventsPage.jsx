import { useState } from 'react';
import { CalendarDays, Ticket, Clock3, Plus, MapPin, Users, Wallet, ScanLine, Hash } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Field from '../../components/ui/Field';
import Notice from '../../components/ui/Notice';
import useApi from '../../hooks/useApi';
import { api, formatDateTime, titleCase } from '../../api/client';
import { useAuth } from '../../auth/AuthContext';
import '../../components/dashboard/DashboardPage.scss';
import '../../components/auth/AuthForm.scss';

const EMPTY_FORM = { name: '', startsAt: '', location: '', capacity: '', price: 'Free' };
const TIMING_TONE = { UPCOMING: 'gold', ONGOING: 'success', COMPLETED: 'neutral' };

export default function AdminEventsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const { data, error, loading, reload } = useApi('/admin/events', { limit: 100 });
  const [isModalOpen, setModalOpen] = useState(false);
  const [isCheckInOpen, setCheckInOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [notice, setNotice] = useState(null);
  const [code, setCode] = useState('');
  const [checkIn, setCheckIn] = useState(null);

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleAdd = async (e) => {
    e.preventDefault();
    setErrors({});
    setFormError('');
    try {
      await api('/admin/events', {
        method: 'POST',
        body: {
          name: form.name,
          location: form.location,
          startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : '',
          capacity: form.capacity,
          price: form.price || 0,
        },
      });
      setModalOpen(false);
      setForm(EMPTY_FORM);
      setNotice({ tone: 'success', text: `Event "${form.name}" created and published on the Events page.` });
      reload();
    } catch (err) {
      setErrors(err.fieldErrors);
      setFormError(err.message);
    }
  };

  const setStatus = async (row, status) => {
    setNotice(null);
    try {
      await api(`/admin/events/${row.id}/status`, { method: 'PATCH', body: { status } });
      setNotice({ tone: 'success', text: `"${row.name}" is now ${status.toLowerCase()}.` });
      reload();
    } catch (err) {
      setNotice({ tone: 'error', text: err.message });
    }
  };

  const doCheckIn = async (e) => {
    e.preventDefault();
    try {
      const res = await api('/admin/tickets/check-in', { method: 'POST', body: { code } });
      setCheckIn({ tone: 'success', text: `✔ ${res.holder} — ${res.event} (${res.ticketType}). Checked in.` });
      setCode('');
      reload();
    } catch (err) {
      setCheckIn({ tone: 'error', text: err.message });
    }
  };

  const rows = (data?.events ?? []).map((ev) => ({
    id: ev.id,
    name: ev.name,
    date: formatDateTime(ev.startsAt),
    location: ev.location,
    sold: ev.sold,
    capacity: ev.capacity,
    price: ev.priceFrom === 0 ? 'Free' : `${(ev.priceFrom ?? 0).toLocaleString()} RWF`,
    status: ev.status,
    timing: ev.timing,
  }));
  const stats = data?.stats;

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Events</h1>
          <p className="dash-page__subtitle">Manage upcoming shows, track ticket sales and check tickets in at the door.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button type="button" className="btn btn--outline" onClick={() => { setCheckIn(null); setCheckInOpen(true); }}>
            <ScanLine size={16} /> Check in ticket
          </button>
          {isAdmin && (
            <button type="button" className="btn btn--gold" onClick={() => setModalOpen(true)}>
              <Plus size={16} /> Add Event
            </button>
          )}
        </div>
      </div>

      <Notice tone={notice?.tone}>{notice?.text}</Notice>
      <Notice tone="error">{error?.message}</Notice>

      <div className="dash-page__stats" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <StatCard icon={CalendarDays} label="Total Events" value={stats?.totalEvents ?? '—'} />
        <StatCard icon={Ticket} label="Tickets Sold" value={stats?.ticketsSold?.toLocaleString() ?? '—'} />
        <StatCard icon={Clock3} label="Upcoming" value={stats?.upcoming ?? '—'} />
        <StatCard icon={Wallet} label="Ticket Revenue" value={stats ? `${stats.ticketRevenue.toLocaleString()} RWF` : '—'} />
      </div>

      <DataTable
        emptyLabel={loading ? 'Loading…' : 'No events yet.'}
        columns={[
          { key: 'name', label: 'Event' },
          { key: 'date', label: 'Date' },
          { key: 'location', label: 'Location' },
          { key: 'price', label: 'Price' },
          { key: 'sold', label: 'Tickets', render: (row) => `${row.sold.toLocaleString()} / ${row.capacity.toLocaleString()}` },
          {
            key: 'status',
            label: 'Status',
            render: (row) =>
              row.status === 'PUBLISHED' ? (
                <Badge tone={TIMING_TONE[row.timing]}>{titleCase(row.timing)}</Badge>
              ) : (
                <Badge tone={row.status === 'CANCELLED' ? 'danger' : 'neutral'}>{titleCase(row.status)}</Badge>
              ),
          },
          ...(isAdmin
            ? [
                {
                  key: 'actions',
                  label: 'Actions',
                  render: (row) =>
                    row.status === 'PUBLISHED' ? (
                      <button type="button" className="btn btn--outline" style={{ padding: '6px 12px', fontSize: '0.78rem' }} onClick={() => setStatus(row, 'CANCELLED')}>
                        Cancel event
                      </button>
                    ) : (
                      <button type="button" className="btn btn--gold" style={{ padding: '6px 12px', fontSize: '0.78rem' }} onClick={() => setStatus(row, 'PUBLISHED')}>
                        Publish
                      </button>
                    ),
                },
              ]
            : []),
        ]}
        rows={rows}
      />

      <Modal isOpen={isModalOpen} title="Add Event" onClose={() => setModalOpen(false)}>
        <Notice tone="error">{formError}</Notice>
        <form className="auth-form" onSubmit={handleAdd} noValidate>
          <Field id="ev-name" label="Event name" icon={CalendarDays} error={errors.name}>
            <input id="ev-name" type="text" placeholder="Event name" value={form.name} onChange={update('name')} />
          </Field>
          <div className="auth-form__row">
            <Field id="ev-date" label="Date & time" icon={Clock3} error={errors.startsAt}>
              <input id="ev-date" type="datetime-local" value={form.startsAt} onChange={update('startsAt')} />
            </Field>
            <Field id="ev-capacity" label="Capacity" icon={Users} error={errors.capacity}>
              <input id="ev-capacity" type="number" min="1" placeholder="e.g. 1000" value={form.capacity} onChange={update('capacity')} />
            </Field>
          </div>
          <div className="auth-form__row">
            <Field id="ev-location" label="Location" icon={MapPin} error={errors.location}>
              <input id="ev-location" type="text" placeholder="Venue, city" value={form.location} onChange={update('location')} />
            </Field>
            <Field id="ev-price" label="Ticket price (RWF)" icon={Ticket} error={errors.price}>
              <input id="ev-price" type="text" placeholder="Free or e.g. 15,000" value={form.price} onChange={update('price')} />
            </Field>
          </div>
          <p className="dash-page__subtitle" style={{ margin: 0 }}>
            Paid tickets need online payments (Paypack), which are not switched on yet. Free events work end to end.
          </p>
          <button type="submit" className="btn btn--gold auth-form__submit">
            Add Event
          </button>
        </form>
      </Modal>

      <Modal isOpen={isCheckInOpen} title="Check in a ticket" onClose={() => setCheckInOpen(false)}>
        <Notice tone={checkIn?.tone}>{checkIn?.text}</Notice>
        <form className="auth-form" onSubmit={doCheckIn} noValidate>
          <Field id="ci-code" label="Ticket code (from the fan’s ticket / QR code)" icon={Hash}>
            <input id="ci-code" type="text" placeholder="BFN-2026-XXXXXXXX" value={code} onChange={(e) => setCode(e.target.value)} autoFocus />
          </Field>
          <button type="submit" className="btn btn--gold auth-form__submit">
            Check in
          </button>
        </form>
      </Modal>
    </div>
  );
}
