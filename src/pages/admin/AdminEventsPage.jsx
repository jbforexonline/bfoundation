import { useState } from 'react';
import { CalendarDays, Ticket, Clock3, Plus, MapPin, Users } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import '../../components/dashboard/DashboardPage.scss';
import '../../components/auth/AuthForm.scss';

const INITIAL_EVENTS = [
  { id: 1, name: 'BFOUNDATION Awards Night 2026', date: 'Dec 12, 2026', location: 'Kigali Convention Centre', sold: 812, capacity: 1500, status: 'Upcoming' },
  { id: 2, name: 'Ultimate Fan Challenge — Live Final', date: 'Oct 3, 2026', location: 'Amahoro Stadium, Kigali', sold: 3400, capacity: 5000, status: 'Upcoming' },
  { id: 3, name: 'Regional Talent Showcase — Musanze', date: 'Sep 20, 2026', location: 'Musanze Youth Center', sold: 210, capacity: 400, status: 'Upcoming' },
  { id: 4, name: 'Regional Talent Showcase — Huye', date: 'Jun 14, 2026', location: 'Huye Community Hall', sold: 380, capacity: 380, status: 'Completed' },
];

const EMPTY_FORM = { name: '', date: '', location: '', capacity: '' };

export default function AdminEventsPage() {
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [isModalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.date.trim() || !form.location.trim()) return;
    // TODO: call your real "create event" endpoint here.
    setEvents((prev) => [
      {
        id: Date.now(),
        name: form.name,
        date: form.date,
        location: form.location,
        sold: 0,
        capacity: Number(form.capacity) || 0,
        status: 'Upcoming',
      },
      ...prev,
    ]);
    setForm(EMPTY_FORM);
    setModalOpen(false);
  };

  const totalSold = events.reduce((sum, e) => sum + e.sold, 0);
  const upcoming = events.filter((e) => e.status === 'Upcoming').length;

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Events</h1>
          <p className="dash-page__subtitle">Manage upcoming shows and track ticket sales.</p>
        </div>
        <button type="button" className="btn btn--gold" onClick={() => setModalOpen(true)}>
          <Plus size={16} /> Add Event
        </button>
      </div>

      <div className="dash-page__stats">
        <StatCard icon={CalendarDays} label="Total Events" value={events.length} />
        <StatCard icon={Ticket} label="Tickets Sold" value={totalSold.toLocaleString()} />
        <StatCard icon={Clock3} label="Upcoming" value={upcoming} />
      </div>

      <DataTable
        columns={[
          { key: 'name', label: 'Event' },
          { key: 'date', label: 'Date' },
          { key: 'location', label: 'Location' },
          { key: 'sold', label: 'Tickets', render: (row) => `${row.sold.toLocaleString()} / ${row.capacity.toLocaleString()}` },
          {
            key: 'status',
            label: 'Status',
            render: (row) => <Badge tone={row.status === 'Upcoming' ? 'gold' : 'neutral'}>{row.status}</Badge>,
          },
        ]}
        rows={events}
      />

      <Modal isOpen={isModalOpen} title="Add Event" onClose={() => setModalOpen(false)}>
        <form className="auth-form" onSubmit={handleAdd} noValidate>
          <div className="auth-form__field">
            <label htmlFor="ev-name">Event name</label>
            <div className="auth-form__input-wrap">
              <CalendarDays size={16} />
              <input id="ev-name" type="text" placeholder="Event name" value={form.name} onChange={update('name')} />
            </div>
          </div>

          <div className="auth-form__row">
            <div className="auth-form__field">
              <label htmlFor="ev-date">Date</label>
              <div className="auth-form__input-wrap">
                <Clock3 size={16} />
                <input id="ev-date" type="text" placeholder="e.g. Dec 12, 2026" value={form.date} onChange={update('date')} />
              </div>
            </div>

            <div className="auth-form__field">
              <label htmlFor="ev-capacity">Capacity</label>
              <div className="auth-form__input-wrap">
                <Users size={16} />
                <input id="ev-capacity" type="number" min="0" placeholder="e.g. 1000" value={form.capacity} onChange={update('capacity')} />
              </div>
            </div>
          </div>

          <div className="auth-form__field">
            <label htmlFor="ev-location">Location</label>
            <div className="auth-form__input-wrap">
              <MapPin size={16} />
              <input id="ev-location" type="text" placeholder="Venue, city" value={form.location} onChange={update('location')} />
            </div>
          </div>

          <button type="submit" className="btn btn--gold auth-form__submit">Add Event</button>
        </form>
      </Modal>
    </div>
  );
}
