import { useState } from 'react';
import { Calendar, MapPin, Check } from 'lucide-react';
import { Link, useOutletContext } from 'react-router-dom';
import PageHero from '../components/PageHero';
import Notice from '../components/ui/Notice';
import useApi from '../hooks/useApi';
import { api, formatDate } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import './EventsPage.scss';

export default function EventsPage() {
  const { user } = useAuth();
  const { openAuth } = useOutletContext() ?? {};
  const { data, error, loading, reload } = useApi('/events', { when: 'upcoming', limit: 50 });
  const [claimed, setClaimed] = useState({});
  const [notice, setNotice] = useState(null);

  const events = (data?.events ?? []).map((ev) => {
    const type = ev.ticketTypes.find((t) => !t.soldOut) ?? ev.ticketTypes[0];
    return {
      id: ev.id,
      title: ev.name,
      date: formatDate(ev.startsAt),
      location: ev.location,
      desc: ev.description,
      price: ev.priceFrom === 0 ? 'Free' : `${(ev.priceFrom ?? 0).toLocaleString()} RWF`,
      type,
      soldOut: ev.soldOut,
    };
  });

  const claimTicket = async (ev) => {
    setNotice(null);
    if (!user) {
      setNotice({ tone: 'info', text: 'Log in to get tickets.' });
      openAuth?.('login');
      return;
    }
    if (ev.type.priceRwf > 0) {
      // Paid tickets need online payment (Paypack), which is not switched on yet.
      setNotice({ tone: 'info', text: 'Online payment for paid tickets is coming soon.' });
      return;
    }
    try {
      await api(`/events/${ev.id}/orders`, { method: 'POST', body: { ticketTypeId: ev.type.id, quantity: 1 } });
      setClaimed((prev) => ({ ...prev, [ev.id]: true }));
      setNotice({ tone: 'success', text: `Your ticket for ${ev.title} is ready. Find it (with its QR code) in your dashboard under Event Tickets.` });
      reload();
    } catch (err) {
      if (err.code === 'TICKET_LIMIT') setClaimed((prev) => ({ ...prev, [ev.id]: true }));
      setNotice({ tone: 'error', text: err.message });
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Events"
        title="Where the community comes together"
        description="From regional showcases to the grand Awards Night, here's what's coming up."
      />

      <section className="events-page section">
        <div className="events-page__inner">
          <Notice tone={notice?.tone}>
            {notice?.text}{' '}
            {notice?.tone === 'success' && user?.role === 'FAN' && (
              <Link to="/dashboard/fan/event-tickets" style={{ color: 'inherit', textDecoration: 'underline' }}>
                View my tickets
              </Link>
            )}
          </Notice>
          <Notice tone="error">{error?.message}</Notice>
          {!loading && !error && events.length === 0 && <Notice tone="info">No upcoming events yet. Check back soon!</Notice>}
          {events.map((ev) => (
            <div className="events-page__card" key={ev.id}>
              <div className="events-page__date-block">
                <Calendar size={20} />
                <span>{ev.date}</span>
              </div>

              <div className="events-page__body">
                <h3>{ev.title}</h3>
                <p className="events-page__location">
                  <MapPin size={14} /> {ev.location}
                </p>
                {ev.desc && <p className="events-page__desc">{ev.desc}</p>}
              </div>

              <div className="events-page__action">
                <p className="events-page__price">{ev.price}</p>
                <button
                  type="button"
                  className={`btn ${claimed[ev.id] ? 'btn--outline' : 'btn--gold'}`}
                  onClick={() => claimTicket(ev)}
                  disabled={claimed[ev.id] || ev.soldOut || !ev.type}
                >
                  {claimed[ev.id] ? (
                    <>
                      <Check size={16} /> Ticket Claimed
                    </>
                  ) : ev.soldOut ? (
                    'Sold Out'
                  ) : (
                    'Get Tickets'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
