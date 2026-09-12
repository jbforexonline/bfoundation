import { useState } from 'react';
import { Heart } from 'lucide-react';
import '../../components/dashboard/DashboardPage.scss';

const INITIAL_FAVORITES = [
  { id: 'f1', name: 'Malaika Uwase', category: 'Best Musician', votes: '18,420 votes' },
  { id: 'f2', name: 'Ishimwe Kevin', category: 'Best Footballer', votes: '21,040 votes' },
  { id: 'f3', name: 'Grace Umutoni', category: 'Best Influencer', votes: '13,500 votes' },
  { id: 'f4', name: 'Divine Ingabire', category: 'Best Comedian', votes: '9,640 votes' },
];

function initials(name) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

export default function FanFavoritesPage() {
  const [favorites, setFavorites] = useState(INITIAL_FAVORITES);

  const remove = (id) => setFavorites((prev) => prev.filter((f) => f.id !== id));

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Favorite Contestants</h1>
          <p className="dash-page__subtitle">Contestants you're following. Get notified when it's time to vote again.</p>
        </div>
      </div>

      {favorites.length === 0 ? (
        <p style={{ color: 'var(--text-muted, #a8a49b)' }}>
          You haven&rsquo;t favorited any contestants yet. Browse the Contestants page to add some.
        </p>
      ) : (
        <div className="dash-page__card-grid">
          {favorites.map((f) => (
            <div className="mini-contestant-card" key={f.id}>
              <div className="mini-contestant-card__avatar">{initials(f.name)}</div>
              <p className="mini-contestant-card__name">{f.name}</p>
              <p className="mini-contestant-card__category">{f.category}</p>
              <p className="mini-contestant-card__votes">{f.votes}</p>
              <button
                type="button"
                className="btn btn--outline mini-contestant-card__remove"
                onClick={() => remove(f.id)}
              >
                <Heart size={15} fill="currentColor" />
                Unfollow
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
