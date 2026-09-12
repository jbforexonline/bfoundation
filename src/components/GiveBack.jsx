import { HandHeart, Plus, Equal } from 'lucide-react';
import './GiveBack.scss';

export default function GiveBack() {
  return (
    <section className="give-back section">
      <div className="give-back__inner">
        <div className="give-back__icon" aria-hidden="true">
          <HandHeart size={26} />
        </div>

        <div className="give-back__copy">
          <h3>Recognition That Gives Back</h3>
          <p>
            Winners can choose to donate their prize. BFOUNDATION adds 500,000 RWF to
            support charity projects that change lives.
          </p>
        </div>

        <div className="give-back__math">
          <div className="give-back__figure">
            <p className="give-back__label">Winner Prize</p>
            <p className="give-back__value">3,000,000 RWF</p>
          </div>
          <Plus size={20} className="give-back__op" />
          <div className="give-back__figure">
            <p className="give-back__label">BFoundation Adds</p>
            <p className="give-back__value">500,000 RWF</p>
          </div>
          <Equal size={20} className="give-back__op" />
          <div className="give-back__figure">
            <p className="give-back__label">Total Impact</p>
            <p className="give-back__value give-back__value--total">3,500,000 RWF</p>
          </div>
        </div>

        <button type="button" className="btn btn--gold give-back__cta">
          Learn More
        </button>
      </div>
    </section>
  );
}
