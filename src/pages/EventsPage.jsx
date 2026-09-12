import { useState } from 'react';
import { Calendar, MapPin, Check } from 'lucide-react';
import PageHero from '../components/PageHero';
import './EventsPage.scss';

const EVENTS = [
  {
    id: 'ev1',
    title: 'BFOUNDATION Awards Night 2026',
    date: 'December 12, 2026',
    location: 'Kigali Convention Centre',
    price: '15,000 RWF',
    desc: 'The grand finale — winners across all 24+ categories are announced and celebrated live on stage.',
  },
  {
    id: 'ev2',
    title: 'Ultimate Fan Challenge — Live Final',
    date: 'October 3, 2026',
    location: 'Amahoro Stadium, Kigali',
    price: '5,000 RWF',
    desc: 'Ambassadors of Christ Choir face off against Chorale de Kigali for the 5,000,000 RWF grand prize.',
  },
  {
    id: 'ev3',
    title: 'Regional Talent Showcase — Musanze',
    date: 'September 20, 2026',
    location: 'Musanze Youth Center',
    price: 'Free',
    desc: 'A community showcase spotlighting nominated musicians, dancers, and comedians from the Northern Province.',
  },
];

export default function EventsPage() {
  const [claimed, setClaimed] = useState({});

  const claimTicket = (id) => setClaimed((prev) => ({ ...prev, [id]: true }));

  return (
    <>
      <PageHero
        eyebrow="Events"
        title="Where the community comes together"
        description="From regional showcases to the grand Awards Night, here's what's coming up."
      />

      <section className="events-page section">
        <div className="events-page__inner">
          {EVENTS.map((ev) => (
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
                <p className="events-page__desc">{ev.desc}</p>
              </div>

              <div className="events-page__action">
                <p className="events-page__price">{ev.price}</p>
                <button
                  type="button"
                  className={`btn ${claimed[ev.id] ? 'btn--outline' : 'btn--gold'}`}
                  onClick={() => claimTicket(ev.id)}
                  disabled={claimed[ev.id]}
                >
                  {claimed[ev.id] ? (
                    <>
                      <Check size={16} /> Ticket Claimed
                    </>
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
