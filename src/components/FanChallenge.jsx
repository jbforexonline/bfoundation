import { ArrowRight } from 'lucide-react';
import './FanChallenge.scss';

export default function FanChallenge() {
  return (
    <section className="fan-challenge section" id="fan-challenge">
      <div className="fan-challenge__inner">
        <div className="fan-challenge__badge">
          <span className="fan-challenge__crown" aria-hidden="true">👑</span>
          <h3>
            Ultimate<br />Fan<br />Challenge
          </h3>
          <span className="fan-challenge__ribbon">6 Months Battle</span>
        </div>

        <div className="fan-challenge__matchup">
          <div className="fan-challenge__team">
            <div className="fan-challenge__crest" aria-hidden="true">✝</div>
            <p>Ambassadors<br />of Christ Choir</p>
          </div>
          <span className="fan-challenge__vs">VS</span>
          <div className="fan-challenge__team">
            <div className="fan-challenge__crest" aria-hidden="true">Æ</div>
            <p>Chorale<br />de Kigali</p>
          </div>
        </div>

        <div className="fan-challenge__prize">
          <p className="fan-challenge__prize-label">Grand Prize</p>
          <p className="fan-challenge__prize-value">5,000,000 RWF</p>
          <p className="fan-challenge__prize-note">
            Winner&rsquo;s fund goes to BFOUNDATION impact projects.
          </p>
          <button className="btn btn--gold" type="button">
            Explore Challenges
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
