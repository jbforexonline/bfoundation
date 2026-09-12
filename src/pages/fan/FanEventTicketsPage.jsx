import { Ticket, MapPin, Calendar } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import '../../components/dashboard/DashboardPage.scss';

const TICKETS = [
  {
    id: 1,
    event: 'BFOUNDATION Awards Night 2026',
    date: 'Dec 12, 2026',
    location: 'Kigali Convention Centre',
    code: 'BFN-2026-A183',
    status: 'Confirmed',
  },
  {
    id: 2,
    event: 'Ultimate Fan Challenge — Live Final',
    date: 'Oct 3, 2026',
    location: 'Amahoro Stadium, Kigali',
    code: 'BFN-2026-F072',
    status: 'Confirmed',
  },
];

export default function FanEventTicketsPage() {
  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Event Tickets</h1>
          <p className="dash-page__subtitle">Tickets you've claimed for upcoming BFOUNDATION events.</p>
        </div>
      </div>

      {TICKETS.length === 0 ? (
        <p style={{ color: '#a8a49b' }}>No tickets yet — check the Events page to see what's coming up.</p>
      ) : (
        <div className="dash-page__list">
          {TICKETS.map((t) => (
            <div className="dash-item" key={t.id}>
              <div className="dash-item__icon">
                <Ticket size={18} />
              </div>
              <div className="dash-item__body">
                <p className="dash-item__title">{t.event}</p>
                <p className="dash-item__meta">
                  <Calendar size={12} style={{ verticalAlign: -2, marginRight: 4 }} />
                  {t.date}
                  {'  ·  '}
                  <MapPin size={12} style={{ verticalAlign: -2, margin: '0 4px 0 2px' }} />
                  {t.location}
                </p>
                <p className="dash-item__meta">Ticket code: {t.code}</p>
              </div>
              <Badge tone="success">{t.status}</Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
