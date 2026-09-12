import { Handshake } from 'lucide-react';
import PageHero from '../components/PageHero';
import './SponsorsPage.scss';

const TIERS = [
  {
    name: 'Platinum Partners',
    tone: 'platinum',
    sponsors: ['MTN Rwanda', 'Bank of Kigali', 'Rwanda Development Board'],
  },
  {
    name: 'Gold Partners',
    tone: 'gold',
    sponsors: ['Skol Brewery', 'Airtel Rwanda', 'Kigali Convention Centre', 'Inyange Industries'],
  },
  {
    name: 'Silver Partners',
    tone: 'silver',
    sponsors: ['Question Coffee', 'RwandAir', 'Zipline Rwanda', 'Urwibutso Enterprises', 'Kivu Choice'],
  },
];

function initials(name) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

export default function SponsorsPage() {
  return (
    <>
      <PageHero
        eyebrow="Sponsors"
        title="Partners powering the platform"
        description="BFOUNDATION is made possible by organizations investing directly in Rwandan talent and community impact."
      />

      <section className="sponsors-page section">
        <div className="sponsors-page__inner">
          {TIERS.map((tier) => (
            <div className="sponsors-page__tier" key={tier.name}>
              <h2 className={`sponsors-page__tier-title sponsors-page__tier-title--${tier.tone}`}>
                {tier.name}
              </h2>
              <div className="sponsors-page__grid">
                {tier.sponsors.map((name) => (
                  <div className="sponsors-page__card" key={name}>
                    <div className={`sponsors-page__logo sponsors-page__logo--${tier.tone}`}>
                      {initials(name)}
                    </div>
                    <p>{name}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="sponsors-page__cta">
            <Handshake size={26} />
            <div>
              <h3>Become a sponsor</h3>
              <p>Partner with BFOUNDATION to reach an engaged, growing community of fans and creators.</p>
            </div>
            <a href="mailto:partnerships@bfoundation.rw" className="btn btn--gold">
              Get in Touch
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
