import CountdownTimer from './CountdownTimer';
import useApi from '../hooks/useApi';
import './RwandaHighlight.scss';

// Counts down to the next category voting deadline (category "End date" set by the admin).
export default function RwandaHighlight() {
  const { data } = useApi('/categories');
  const now = Date.now();
  const deadlines = (data?.categories ?? [])
    .map((c) => c.endDate && new Date(c.endDate))
    .filter((d) => d && d.getTime() > now)
    .sort((a, b) => a - b);
  const deadline = deadlines[0];

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
        {deadline ? (
          <>
            <p className="rwanda-highlight__sub">({deadline.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })})</p>
            <CountdownTimer targetDate={deadline} />
          </>
        ) : (
          <p className="rwanda-highlight__sub">Voting dates will be announced soon.</p>
        )}
      </div>
    </div>
  );
}
