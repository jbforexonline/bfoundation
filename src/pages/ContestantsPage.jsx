import { useState } from 'react';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import './ContestantsPage.scss';

const CATEGORY_FILTERS = ['All', 'Best Musician', 'Best Footballer', 'Best Influencer', 'Best Comedian', 'Best TikToker'];

const CONTESTANTS = [
  { name: 'Malaika Uwase', category: 'Best Musician', votes: '18,420' },
  { name: 'Ishimwe Kevin', category: 'Best Footballer', votes: '21,040' },
  { name: 'Grace Umutoni', category: 'Best Influencer', votes: '13,500' },
  { name: 'Divine Ingabire', category: 'Best Comedian', votes: '9,640' },
  { name: 'Bruce Karenzi', category: 'Best Musician', votes: '15,310' },
  { name: 'Emmanuel Ndayisenga', category: 'Best Footballer', votes: '17,760' },
  { name: 'Claudine Mukamana', category: 'Best Influencer', votes: '11,890' },
  { name: 'Sandrine Uwera', category: 'Best Comedian', votes: '8,120' },
  { name: 'Aline Mutesi', category: 'Best TikToker', votes: '10,420' },
  { name: 'Eric Niyonzima', category: 'Best TikToker', votes: '7,980' },
];

function initials(name) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

export default function ContestantsPage() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');

  const filtered = CONTESTANTS.filter((c) => {
    const matchesFilter = filter === 'All' || c.category === filter;
    const matchesQuery = c.name.toLowerCase().includes(query.trim().toLowerCase());
    return matchesFilter && matchesQuery;
  });

  return (
    <>
      <PageHero
        eyebrow="Contestants"
        title="Meet this month's contestants"
        description="Browse every contestant currently in the running and cast your vote for your favorites."
      />

      <section className="contestants-page section">
        <div className="contestants-page__inner">
          <div className="contestants-page__controls">
            <div className="contestants-page__search">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search contestants..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div className="contestants-page__filters">
              {CATEGORY_FILTERS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={c === filter ? 'is-active' : ''}
                  onClick={() => setFilter(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="contestants-page__empty">No contestants match your search.</p>
          ) : (
            <div className="contestants-page__grid">
              {filtered.map((c) => (
                <div className="contestants-page__card" key={c.name}>
                  <div className="contestants-page__avatar">{initials(c.name)}</div>
                  <p className="contestants-page__name">{c.name}</p>
                  <p className="contestants-page__category">{c.category}</p>
                  <p className="contestants-page__votes">{c.votes} votes</p>
                  <Link to="/vote" className="btn btn--gold contestants-page__cta">
                    Vote Now
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
