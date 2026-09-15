import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MessageCircle, Vote, ChevronDown, Instagram, Link2 } from 'lucide-react';
import '../../components/dashboard/DashboardPage.scss';
import './FanContestantsPage.scss';

const CATEGORY_FILTERS = ['All', 'Best Musician', 'Best Footballer', 'Best Influencer', 'Best Comedian'];

const CONTESTANTS = [
  {
    id: 1,
    name: 'Malaika Uwase',
    category: 'Best Musician',
    votes: '18,420',
    bio: 'Singer-songwriter from Kigali blending traditional Rwandan melodies with modern Afrobeat production.',
    instagram: '@malaika.uwase',
    portfolio: 'malaikauwase.com',
  },
  {
    id: 2,
    name: 'Ishimwe Kevin',
    category: 'Best Footballer',
    votes: '21,040',
    bio: 'Midfielder known for his work with youth football academies across the Southern Province.',
    instagram: '@ishimwe.kevin',
    portfolio: 'ishimwekevin.rw',
  },
  {
    id: 3,
    name: 'Grace Umutoni',
    category: 'Best Influencer',
    votes: '13,500',
    bio: 'Lifestyle creator focused on sustainable fashion made from local Rwandan textiles.',
    instagram: '@grace.umutoni',
    portfolio: 'graceumutoni.com',
  },
  {
    id: 4,
    name: 'Divine Ingabire',
    category: 'Best Comedian',
    votes: '9,640',
    bio: 'Stand-up comedian and radio host, known for sketches on everyday Kigali life.',
    instagram: '@divine.ingabire',
    portfolio: 'divineingabire.rw',
  },
];

function initials(name) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

export default function FanContestantsPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [expandedId, setExpandedId] = useState(null);

  const filtered = CONTESTANTS.filter((c) => {
    const matchesFilter = filter === 'All' || c.category === filter;
    const matchesQuery = c.name.toLowerCase().includes(query.trim().toLowerCase());
    return matchesFilter && matchesQuery;
  });

  const goMessage = (name) => navigate('/dashboard/fan/messages', { state: { openName: name } });
  const goVote = (contestant) => navigate('/dashboard/fan/vote', { state: { contestant } });

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Contestants</h1>
          <p className="dash-page__subtitle">Browse full profiles, message a contestant, or cast a vote.</p>
        </div>
      </div>

      <div className="fan-contestants__controls">
        <div className="fan-contestants__search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search contestants..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="fan-contestants__filters">
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

      <div className="fan-contestants__list">
        {filtered.map((c) => {
          const isOpen = expandedId === c.id;
          return (
            <div className={`fan-contestants__card ${isOpen ? 'is-open' : ''}`} key={c.id}>
              <button
                type="button"
                className="fan-contestants__summary"
                onClick={() => setExpandedId(isOpen ? null : c.id)}
              >
                <span className="fan-contestants__avatar">{initials(c.name)}</span>
                <span className="fan-contestants__summary-text">
                  <span className="fan-contestants__name">{c.name}</span>
                  <span className="fan-contestants__category">{c.category} · {c.votes} votes</span>
                </span>
                <ChevronDown size={18} className="fan-contestants__chevron" />
              </button>

              {isOpen && (
                <div className="fan-contestants__details">
                  <p className="fan-contestants__bio">{c.bio}</p>

                  <div className="fan-contestants__gallery">
                    <span />
                    <span />
                    <span />
                  </div>

                  <div className="fan-contestants__links">
                    <span><Instagram size={14} /> {c.instagram}</span>
                    <span><Link2 size={14} /> {c.portfolio}</span>
                  </div>

                  <div className="fan-contestants__actions">
                    <button type="button" className="btn btn--outline" onClick={() => goMessage(c.name)}>
                      <MessageCircle size={15} /> Message
                    </button>
                    <button type="button" className="btn btn--gold" onClick={() => goVote(c)}>
                      <Vote size={15} /> Vote Now
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
