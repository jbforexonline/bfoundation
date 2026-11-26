import { useState } from 'react';
import { Search, BadgeCheck } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import Notice from '../components/ui/Notice';
import useApi from '../hooks/useApi';
import PageHero from '../components/PageHero';
import './ContestantsPage.scss';

function initials(name) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

export default function ContestantsPage() {
  const [params] = useSearchParams();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState(params.get('category') ?? 'all'); // category slug
  const { data, error, loading } = useApi('/contestants', { limit: 100, sort: 'level' });
  const { data: catData } = useApi('/categories');

  // Only categories that currently have contestants, as filter buttons.
  const filters = [
    { slug: 'all', name: 'All' },
    ...(catData?.categories ?? []).filter((c) => c.contestantCount > 0).map((c) => ({ slug: c.slug, name: c.name })),
  ];

  const filtered = (data?.contestants ?? []).filter((c) => {
    const matchesFilter = filter === 'all' || c.category.slug === filter;
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
              {filters.map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  className={c.slug === filter ? 'is-active' : ''}
                  onClick={() => setFilter(c.slug)}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <Notice tone="error">{error?.message}</Notice>
          {loading ? (
            <p className="contestants-page__empty">Loading contestants…</p>
          ) : filtered.length === 0 ? (
            <p className="contestants-page__empty">No contestants match your search.</p>
          ) : (
            <div className="contestants-page__grid">
              {filtered.map((c) => (
                <div className="contestants-page__card" key={c.id}>
                  <div className="contestants-page__avatar" style={c.profileImage ? { padding: 0, overflow: 'hidden' } : undefined}>
                    {c.profileImage ? (
                      <img src={c.profileImage} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      initials(c.name)
                    )}
                  </div>
                  <p className="contestants-page__name">
                    {c.name} {c.verified && <BadgeCheck size={15} style={{ color: '#f0a93a', verticalAlign: '-2px' }} aria-label="Verified" />}
                  </p>
                  <p className="contestants-page__category">{c.category.name}</p>
                  {/* The public sees the level badge, never the exact vote count. */}
                  <p className="contestants-page__votes">
                    {c.level.label}
                    {c.officialNominee ? ' · Official Nominee' : ''}
                  </p>
                  <Link to={`/vote?category=${c.category.slug}`} className="btn btn--gold contestants-page__cta">
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
