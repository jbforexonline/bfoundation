import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import useApi from '../hooks/useApi';
import { initialsOf } from '../api/client';
import './HallOfFame.scss';

// Home-page podium: the latest year's three featured winners (#2, #1, #3 left to right).
export default function HallOfFame() {
  const { data } = useApi('/hall-of-fame/podium');
  const winners = data?.winners ?? [];
  const byRank = [...winners].sort((a, b) => (a.rank ?? 9) - (b.rank ?? 9));
  const podium = [byRank[1], byRank[0], byRank[2]].filter(Boolean);

  return (
    <div className="hall-of-fame">
      <div className="hall-of-fame__title">
        <span className="hall-of-fame__badge" aria-hidden="true">🏆</span>
        <h3>Hall of Fame</h3>
      </div>

      <div className="hall-of-fame__podium">
        {podium.map((winner) => {
          const first = winner === byRank[0];
          const rank = String(byRank.indexOf(winner) + 1).padStart(2, '0');
          return (
            <div className={`hall-of-fame__winner hall-of-fame__winner--${first ? 'lg' : 'sm'}`} key={winner.id}>
              <span className="hall-of-fame__rank hall-of-fame__rank--top">{rank}</span>
              <div className="hall-of-fame__avatar" aria-hidden="true" style={winner.photo ? { overflow: 'hidden', padding: 0 } : undefined}>
                {winner.photo ? <img src={winner.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initialsOf(winner.name)}
              </div>
              <span className="hall-of-fame__rank hall-of-fame__rank--bottom">01</span>
              <p className="hall-of-fame__name">{winner.name}</p>
              <p className="hall-of-fame__role">{winner.category}</p>
              <p className="hall-of-fame__year">{data.year} Winner</p>
            </div>
          );
        })}
      </div>

      <Link to="/hall-of-fame" className="btn btn--gold hall-of-fame__cta">
        View Hall of Fame
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
