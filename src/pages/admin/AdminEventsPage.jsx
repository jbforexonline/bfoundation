import { CalendarDays, Ticket, Clock3 } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import '../../components/dashboard/DashboardPage.scss';

const EVENTS = [
  { id: 1, name: 'BFOUNDATION Awards Night 2026', date: 'Dec 12, 2026', location: 'Kigali Convention Centre', sold: 812, capacity: 1500, status: 'Upcoming' },
  { id: 2, name: 'Ultimate Fan Challenge — Live Final', date: 'Oct 3, 2026', location: 'Amahoro Stadium, Kigali', sold: 3400, capacity: 5000, status: 'Upcoming' },
  { id: 3, name: 'Regional Talent Showcase — Musanze', date: 'Sep 20, 2026', location: 'Musanze Youth Center', sold: 210, capacity: 400, status: 'Upcoming' },
  { id: 4, name: 'Regional Talent Showcase — Huye', date: 'Jun 14, 2026', location: 'Huye Community Hall', sold: 380, capacity: 380, status: 'Completed' },
];

export default function AdminEventsPage() {
  const totalSold = EVENTS.reduce((sum, e) => sum + e.sold, 0);
  const upcoming = EVENTS.filter((e) => e.status === 'Upcoming').length;

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Events</h1>
          <p className="dash-page__subtitle">Manage upcoming shows and track ticket sales.</p>
        </div>
      </div>

      <div className="dash-page__stats">
        <StatCard icon={CalendarDays} label="Total Events" value={EVENTS.length} />
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
        rows={EVENTS}
      />
    </div>
  );
}
