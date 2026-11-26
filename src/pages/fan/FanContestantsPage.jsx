import { useEffect, useState } from 'react';
import { Search, Vote, ChevronDown, Instagram, Link2, BadgeCheck, Check } from 'lucide-react';
import Notice from '../../components/ui/Notice';
import useApi from '../../hooks/useApi';
import { api } from '../../api/client';
import '../../components/dashboard/DashboardPage.scss';
import './FanContestantsPage.scss';

function initials(name) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

const instagramUrl = (handle) => `https://instagram.com/${handle.replace(/^@/, '')}`;
const webUrl = (url) => (/^https?:\/\//i.test(url) ? url : `https://${url}`);

// Real contestants from the backend. Fans can read full profiles and use their free vote
// (one per category). Fans see the level badge, never the exact vote count.
export default function FanContestantsPage() {
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // category slug
  const [expandedId, setExpandedId] = useState(null);
  const [details, setDetails] = useState({}); // { [id]: contestant with gallery }
  const [ballot, setBallot] = useState({}); // { [categorySlug]: contestantId }
  const [sending, setSending] = useState(null);
  const [notice, setNotice] = useState(null);

  // Search after the fan stops typing.
  useEffect(() => {
    const t = setTimeout(() => setSearch(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  const { data: catData } = useApi('/categories');
  const categories = (catData?.categories ?? []).filter((c) => c.contestantCount > 0);
  const { data, error, loading } = useApi('/contestants', {
    limit: 100,
    sort: 'name',
    category: filter === 'all' ? undefined : filter,
    search: search || undefined,
  });
  const contestants = data?.contestants ?? [];

  useEffect(() => {
    api('/votes/free-status')
      .then((d) =>
        setBallot(Object.fromEntries(d.categories.filter((c) => c.votedFor).map((c) => [c.category.slug, c.votedFor.id])))
      )
      .catch(() => {});
  }, []);

  const toggle = async (c) => {
    const opening = expandedId !== c.id;
    setExpandedId(opening ? c.id : null);
    if (opening && !details[c.id]) {
      try {
        const res = await api(`/contestants/${c.id}`);
        setDetails((prev) => ({ ...prev, [c.id]: res.contestant }));
      } catch {
        /* the summary is still shown */
      }
    }
  };

  const castVote = async (c) => {
    setNotice(null);
    setSending(c.id);
    try {
      await api('/votes/free', { method: 'POST', body: { contestantId: c.id } });
      setBallot((prev) => ({ ...prev, [c.category.slug]: c.id }));
      setNotice({ tone: 'success', text: `Your vote for ${c.name} in ${c.category.name} has been recorded. Thank you!` });
    } catch (err) {
      setNotice({
        tone: 'error',
        text:
          err.code === 'EMAIL_NOT_VERIFIED'
            ? 'Please verify your email address first (check your inbox for the link we sent when you signed up).'
            : err.message,
      });
    } finally {
      setSending(null);
    }
  };

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Contestants</h1>
          <p className="dash-page__subtitle">Browse full profiles and cast your free vote — one per category.</p>
        </div>
      </div>

      <Notice tone="error">{error?.message}</Notice>
      {notice && <Notice tone={notice.tone}>{notice.text}</Notice>}

      <div className="fan-contestants__controls">
        <div className="fan-contestants__search">
          <Search size={16} />
          <input type="text" placeholder="Search contestants..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="fan-contestants__filters">
          <button type="button" className={filter === 'all' ? 'is-active' : ''} onClick={() => setFilter('all')}>
            All
          </button>
          {categories.map((cat) => (
            <button key={cat.id} type="button" className={cat.slug === filter ? 'is-active' : ''} onClick={() => setFilter(cat.slug)}>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {loading && contestants.length === 0 ? (
        <p style={{ color: '#a8a49b' }}>Loading contestants…</p>
      ) : contestants.length === 0 ? (
        <p style={{ color: '#a8a49b' }}>No contestants found.</p>
      ) : (
        <div className="fan-contestants__list">
          {contestants.map((c) => {
            const isOpen = expandedId === c.id;
            const full = details[c.id] ?? c;
            const votedFor = ballot[c.category.slug];
            const gallery = full.gallery ?? [];
            return (
              <div className={`fan-contestants__card ${isOpen ? 'is-open' : ''}`} key={c.id}>
                <button type="button" className="fan-contestants__summary" onClick={() => toggle(c)}>
                  <span className="fan-contestants__avatar">
                    {c.profileImage ? <img src={c.profileImage} alt="" /> : initials(c.name)}
                  </span>
                  <span className="fan-contestants__summary-text">
                    <span className="fan-contestants__name">
                      {c.name} {c.verified && <BadgeCheck size={14} style={{ color: '#f0a93a', verticalAlign: '-2px' }} aria-label="Verified" />}
                    </span>
                    <span className="fan-contestants__category">
                      {c.category.name} · {c.level.label}
                      {c.officialNominee ? ' · Official Nominee' : ''}
                    </span>
                  </span>
                  <ChevronDown size={18} className="fan-contestants__chevron" />
                </button>

                {isOpen && (
                  <div className="fan-contestants__details">
                    <p className="fan-contestants__bio">{full.bio || 'This contestant has not written a bio yet.'}</p>

                    {gallery.length > 0 && (
                      <div className="fan-contestants__gallery">
                        {gallery.slice(0, 6).map((m) => (
                          <a key={m.id} href={m.url} target="_blank" rel="noreferrer">
                            <img src={m.url} alt={`${c.name} gallery`} />
                          </a>
                        ))}
                      </div>
                    )}

                    {(full.instagram || full.portfolioUrl) && (
                      <div className="fan-contestants__links">
                        {full.instagram && (
                          <a href={instagramUrl(full.instagram)} target="_blank" rel="noreferrer">
                            <Instagram size={14} /> {full.instagram}
                          </a>
                        )}
                        {full.portfolioUrl && (
                          <a href={webUrl(full.portfolioUrl)} target="_blank" rel="noreferrer">
                            <Link2 size={14} /> {full.portfolioUrl}
                          </a>
                        )}
                      </div>
                    )}

                    <div className="fan-contestants__actions">
                      {votedFor === c.id ? (
                        <button type="button" className="btn btn--outline" disabled>
                          <Check size={15} /> You voted for {c.name.split(' ')[0]}
                        </button>
                      ) : votedFor ? (
                        <button type="button" className="btn btn--outline" disabled title="One free vote per category">
                          <Vote size={15} /> Free vote used in {c.category.name}
                        </button>
                      ) : (
                        <button type="button" className="btn btn--gold" disabled={sending === c.id} onClick={() => castVote(c)}>
                          <Vote size={15} /> {sending === c.id ? 'Voting…' : 'Vote (free)'}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
