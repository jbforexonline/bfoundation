import { useState } from 'react';
import { Trophy } from 'lucide-react';
import PageHero from '../components/PageHero';
import useApi from '../hooks/useApi';
import { initialsOf } from '../api/client';
import './HallOfFamePage.scss';

export default function HallOfFamePage() {
  const [year, setYear] = useState(null); // null = latest
  const { data, error, loading } = useApi('/hall-of-fame', { year: year ?? undefined });
  const years = data?.years ?? [];
  const selected = data?.year;
  const winners = data?.winners ?? [];

  return (
    <>
      <PageHero
        eyebrow="Hall of Fame"
        title="Every winner. Every year."
        description="A permanent record of the talent, entrepreneurs and community builders BFOUNDATION has recognized since the awards began."
      >
        <div className="hof-years" role="tablist" aria-label="Select year">
          {years.map((y) => (
            <button
              key={y}
              type="button"
              role="tab"
              aria-selected={y === selected}
              className={y === selected ? 'is-active' : ''}
              onClick={() => setYear(y)}
            >
              {y}
            </button>
          ))}
        </div>
      </PageHero>

      <section className="hof-page section">
        <div className="hof-page__inner">
          {error && <p style={{ color: '#d13b3b', textAlign: 'center' }}>{error.message}</p>}
          {loading && !data && <p style={{ color: '#a8a49b', textAlign: 'center' }}>Loading winners…</p>}
          {data && winners.length === 0 && <p style={{ color: '#a8a49b', textAlign: 'center' }}>The first winners will appear here after the awards.</p>}
          <div className="hof-page__grid">
            {winners.map((winner) => (
              <div className={`hof-page__card ${winner.featured ? 'hof-page__card--featured' : ''}`} key={winner.id}>
                {winner.featured && (
                  <span className="hof-page__crown" aria-hidden="true">
                    <Trophy size={14} />
                  </span>
                )}
                <div className="hof-page__avatar" style={winner.photo ? { overflow: 'hidden', padding: 0 } : undefined}>
                  {winner.photo ? <img src={winner.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initialsOf(winner.name)}
                </div>
                <p className="hof-page__name">{winner.name}</p>
                <p className="hof-page__category">{winner.category}</p>
                <p className="hof-page__year">{selected} Winner</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
