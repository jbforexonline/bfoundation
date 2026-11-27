import { useState } from 'react';
import { Calendar, MapPin, Check, Smartphone } from 'lucide-react';
import { Link, useOutletContext } from 'react-router-dom';
import PageHero from '../components/PageHero';
import Notice from '../components/ui/Notice';
import Modal from '../components/ui/Modal';
import Field from '../components/ui/Field';
import PaymentWaiting from '../components/payments/PaymentWaiting';
import { isRwandaMobileMoney, usePaymentConfig } from '../api/payments';
import '../components/auth/AuthForm.scss';
import useApi from '../hooks/useApi';
import { api, formatDate, formatRwf } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import './EventsPage.scss';

export default function EventsPage() {
  const { user } = useAuth();
  const { openAuth } = useOutletContext() ?? {};
  const { data, error, loading, reload } = useApi('/events', { when: 'upcoming', limit: 50 });
  const [claimed, setClaimed] = useState({});
  const [notice, setNotice] = useState(null);
  const payConfig = usePaymentConfig();
  // Paid ticket checkout: { ev, phone, error, started: { order, payment, instructions }, done }
  const [checkout, setCheckout] = useState(null);

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
      if (!payConfig?.enabled) {
        setNotice({ tone: 'info', text: 'Online payment for paid tickets is not switched on yet.' });
        return;
      }
      setCheckout({ ev, phone: user.phone ?? '', error: '', started: null, done: null });
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

  // Paid ticket: start the Paypack payment; the seat is held while the fan approves it on their phone.
  const startPayment = async (e) => {
    e.preventDefault();
    if (!isRwandaMobileMoney(checkout.phone)) {
      setCheckout((c) => ({ ...c, error: 'Enter an MTN or Airtel Rwanda number (07X XXX XXXX).' }));
      return;
    }
    try {
      const data = await api(`/events/${checkout.ev.id}/orders`, {
        method: 'POST',
        body: { ticketTypeId: checkout.ev.type.id, quantity: 1, phone: checkout.phone },
      });
      setCheckout((c) => ({ ...c, error: '', started: data }));
    } catch (err) {
      setCheckout((c) => ({ ...c, error: err.fieldErrors?.phone || err.message }));
    }
  };

  const closeCheckout = async () => {
    // Leaving before paying releases the held seat.
    if (checkout?.started && !checkout.done) {
      await api(`/tickets/orders/${checkout.started.order.id}/cancel`, { method: 'POST' }).catch(() => {});
    }
    if (checkout?.done === 'SUCCESSFUL') {
      setClaimed((prev) => ({ ...prev, [checkout.ev.id]: true }));
      setNotice({ tone: 'success', text: `Your ticket for ${checkout.ev.title} is ready. Find it (with its QR code) in your dashboard under Event Tickets.` });
    }
    setCheckout(null);
    reload();
  };

  return (
    <>
      <Modal isOpen={Boolean(checkout)} title={checkout ? `${checkout.ev.title} — ${checkout.ev.type.name}` : ''} onClose={closeCheckout}>
        {checkout && !checkout.started && (
          <form className="auth-form" onSubmit={startPayment} noValidate>
            <p style={{ fontSize: '0.9rem' }}>
              1 ticket · <strong>{formatRwf(checkout.ev.type.priceRwf)}</strong> · paid with MTN MoMo or Airtel Money
            </p>
            {payConfig?.mode === 'test' && <Notice tone="info">Test mode: no real money is taken.</Notice>}
            <Field id="tk-phone" label="Mobile money number" icon={Smartphone} error={checkout.error}>
              <input
                id="tk-phone"
                type="tel"
                placeholder="078 xxx xxxx"
                value={checkout.phone}
                onChange={(e) => setCheckout((c) => ({ ...c, phone: e.target.value, error: '' }))}
              />
            </Field>
            <p style={{ color: '#a8a49b', fontSize: '0.8rem' }}>
              Your seat is held for {payConfig?.ticketHoldMinutes ?? 15} minutes while you approve the prompt on your phone.
            </p>
            <button type="submit" className="btn btn--gold auth-form__submit">
              Pay {formatRwf(checkout.ev.type.priceRwf)}
            </button>
          </form>
        )}
        {checkout?.started && (
          <div style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
            <PaymentWaiting
              payment={checkout.started.payment}
              instructions={checkout.started.instructions}
              mode={payConfig?.mode}
              onFinished={(status) => setCheckout((c) => ({ ...c, done: status }))}
            />
            {checkout.done && (
              <button type="button" className="btn btn--gold" onClick={closeCheckout}>
                {checkout.done === 'SUCCESSFUL' ? 'Done' : 'Close'}
              </button>
            )}
          </div>
        )}
      </Modal>

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
