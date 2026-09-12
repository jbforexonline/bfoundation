import CountdownTimer from './CountdownTimer';
import './RwandaHighlight.scss';

// Voting window: one month from now, for demo purposes.
const VOTE_DEADLINE = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000 + 18 * 60 * 1000);

export default function RwandaHighlight() {
  return (
    <div className="rwanda-highlight">
      <div className="rwanda-highlight__art">
        <img
          src="/images/rwanda-diamond.jpg"
          alt="Map of Rwanda glowing over a night skyline, with a golden diamond and the words Honoring Diverse Talents, Building a Greater Rwanda"
          className="rwanda-highlight__image"
        />
      </div>

      <div className="rwanda-highlight__panel">
        <p className="rwanda-highlight__heading">Voting Ends In</p>
        <p className="rwanda-highlight__sub">(This competition takes 1 month)</p>
        <CountdownTimer targetDate={VOTE_DEADLINE} />
      </div>
    </div>
  );
}
