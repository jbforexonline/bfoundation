import { ArrowRight } from 'lucide-react';
import './HallOfFame.scss';

const WINNERS = [
  {
    rank: '02',
    name: 'Malaika Uwase',
    role: 'Best Musician',
    year: '2024 Winner',
    initials: 'MU',
    size: 'sm',
  },
  {
    rank: '01',
    name: 'Jean Claude',
    role: 'Entrepreneur',
    year: '2024 Winner',
    initials: 'JC',
    size: 'lg',
    featured: true,
  },
  {
    rank: '03',
    name: 'Ishimwe Kevin',
    role: 'Best Footballer',
    year: '2024 Winner',
    initials: 'IK',
    size: 'sm',
  },
];

export default function HallOfFame() {
  return (
    <div className="hall-of-fame">
      <div className="hall-of-fame__title">
        <span className="hall-of-fame__badge" aria-hidden="true">🏆</span>
        <h3>Hall of Fame</h3>
      </div>

      <div className="hall-of-fame__podium">
        {WINNERS.map((winner) => (
          <div
            className={`hall-of-fame__winner hall-of-fame__winner--${winner.size}`}
            key={winner.name}
          >
            <span className="hall-of-fame__rank hall-of-fame__rank--top">{winner.rank}</span>
            <div className="hall-of-fame__avatar" aria-hidden="true">
              {winner.initials}
            </div>
            <span className="hall-of-fame__rank hall-of-fame__rank--bottom">01</span>
            <p className="hall-of-fame__name">{winner.name}</p>
            <p className="hall-of-fame__role">{winner.role}</p>
            <p className="hall-of-fame__year">{winner.year}</p>
          </div>
        ))}
      </div>

      <button className="btn btn--gold hall-of-fame__cta" type="button">
        View Hall of Fame
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
