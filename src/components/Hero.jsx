import { Trophy, Users2, Star, Sun, Heart } from 'lucide-react';
import HallOfFame from './HallOfFame';
import RwandaHighlight from './RwandaHighlight';
import './Hero.scss';

const PILLARS = [
  { icon: Star, label: 'Recognizing Talent' },
  { icon: Users2, label: 'Empowering Communities' },
  { icon: Sun, label: 'Inspiring Generations' },
  { icon: Heart, label: 'Giving Back to Society' },
];

export default function Hero() {
  return (
    <section className="hero section" id="home">
      <div className="hero__inner">
        <div className="hero__copy">
          <h1 className="hero__headline">
            <span className="hero__line hero__line--white">Recognizing excellence.</span>
            <span className="hero__line hero__line--gold">Empowering potential.</span>
            <span className="hero__line hero__line--green">Inspiring Rwanda.</span>
          </h1>

          <p className="hero__description">
            BFOUNDATION is Africa&rsquo;s Digital Recognition Platform celebrating talent,
            connecting communities and creating impact.
          </p>

          <div className="hero__buttons">
            <button className="btn btn--outline hero__vote-btn" type="button">
              <Trophy size={18} />
              <span>
                Vote Now
                <small>Support Your Favorite</small>
              </span>
            </button>
            <button className="btn btn--outline hero__nominate-btn" type="button">
              <Users2 size={18} />
              <span>
                Nominate Someone
                <small>Recognize a Talent</small>
              </span>
            </button>
          </div>

          <ul className="hero__pillars">
            {PILLARS.map(({ icon: Icon, label }) => (
              <li key={label}>
                <Icon size={16} />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="hero__hof">
          <HallOfFame />
        </div>

        <div className="hero__rwanda">
          <RwandaHighlight />
        </div>
      </div>
    </section>
  );
}
