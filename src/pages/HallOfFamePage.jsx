import { useState } from 'react';
import { Trophy } from 'lucide-react';
import PageHero from '../components/PageHero';
import './HallOfFamePage.scss';

const YEARS = ['2024', '2023', '2022'];

const WINNERS_BY_YEAR = {
  '2024': [
    { name: 'Jean Claude', category: 'Entrepreneur', featured: true },
    { name: 'Malaika Uwase', category: 'Best Musician', featured: true },
    { name: 'Ishimwe Kevin', category: 'Best Footballer', featured: true },
    { name: 'Aline Mutesi', category: 'Best TikToker' },
    { name: 'Eric Niyonzima', category: 'Best YouTuber' },
    { name: 'Divine Ingabire', category: 'Best Comedian' },
    { name: 'Patrick Habimana', category: 'Best Journalist' },
    { name: 'Grace Umutoni', category: 'Best Influencer' },
    { name: 'Samuel Bizimana', category: 'Best Dancer' },
    { name: 'Christelle Uwase', category: 'Best DJ' },
  ],
  '2023': [
    { name: 'Olivier Mugisha', category: 'Entrepreneur', featured: true },
    { name: 'Diane Iradukunda', category: 'Best Musician', featured: true },
    { name: 'Emmanuel Ndayisenga', category: 'Best Footballer', featured: true },
    { name: 'Josiane Umuhoza', category: 'Best TikToker' },
    { name: 'Bruce Karenzi', category: 'Best YouTuber' },
    { name: 'Sandrine Uwera', category: 'Best Comedian' },
    { name: 'Fabrice Nsengimana', category: 'Best Journalist' },
    { name: 'Claudine Mukamana', category: 'Best Influencer' },
  ],
  '2022': [
    { name: 'Alexis Rugamba', category: 'Entrepreneur', featured: true },
    { name: 'Vanessa Ishimwe', category: 'Best Musician', featured: true },
    { name: 'David Habyarimana', category: 'Best Footballer', featured: true },
    { name: 'Nadia Kayitesi', category: 'Best TikToker' },
    { name: 'Kevin Munyaneza', category: 'Best YouTuber' },
  ],
};

function initials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function HallOfFamePage() {
  const [year, setYear] = useState(YEARS[0]);
  const winners = WINNERS_BY_YEAR[year] ?? [];

  return (
    <>
      <PageHero
        eyebrow="Hall of Fame"
        title="Every winner. Every year."
        description="A permanent record of the talent, entrepreneurs and community builders BFOUNDATION has recognized since the awards began."
      >
        <div className="hof-years" role="tablist" aria-label="Select year">
          {YEARS.map((y) => (
            <button
              key={y}
              type="button"
              role="tab"
              aria-selected={y === year}
              className={y === year ? 'is-active' : ''}
              onClick={() => setYear(y)}
            >
              {y}
            </button>
          ))}
        </div>
      </PageHero>

      <section className="hof-page section">
        <div className="hof-page__inner">
          <div className="hof-page__grid">
            {winners.map((winner) => (
              <div
                className={`hof-page__card ${winner.featured ? 'hof-page__card--featured' : ''}`}
                key={`${year}-${winner.name}`}
              >
                {winner.featured && (
                  <span className="hof-page__crown" aria-hidden="true">
                    <Trophy size={14} />
                  </span>
                )}
                <div className="hof-page__avatar">{initials(winner.name)}</div>
                <p className="hof-page__name">{winner.name}</p>
                <p className="hof-page__category">{winner.category}</p>
                <p className="hof-page__year">{year} Winner</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
