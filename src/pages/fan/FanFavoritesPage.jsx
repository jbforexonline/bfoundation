import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, MessageCircle } from 'lucide-react';
import Notice from '../../components/ui/Notice';
import useApi from '../../hooks/useApi';
import { api, initialsOf } from '../../api/client';
import '../../components/dashboard/DashboardPage.scss';

export default function FanFavoritesPage() {
  const navigate = useNavigate();
  const { data, error, loading, reload } = useApi('/favorites');
  const [actionError, setActionError] = useState('');
  const favorites = data?.favorites ?? [];

  const remove = async (id) => {
    setActionError('');
    try {
      await api(`/favorites/${id}`, { method: 'DELETE' });
      reload();
    } catch (err) {
      setActionError(err.message);
    }
  };

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Favorite Contestants</h1>
          <p className="dash-page__subtitle">Contestants you follow. You&rsquo;ll be notified when they post an update.</p>
        </div>
      </div>

      <Notice tone="error">{error?.message || actionError}</Notice>

      {loading && !data ? (
        <p style={{ color: '#a8a49b' }}>Loading…</p>
      ) : favorites.length === 0 ? (
        <p style={{ color: '#a8a49b' }}>
          You haven&rsquo;t favorited any contestants yet. Tap the heart on the{' '}
          <Link to="/dashboard/fan/contestants" style={{ color: '#f0a93a' }}>Contestants</Link> page to add some.
        </p>
      ) : (
        <div className="dash-page__card-grid">
          {favorites.map((f) => (
            <div className="mini-contestant-card" key={f.id}>
              <div className="mini-contestant-card__avatar" style={{ overflow: 'hidden' }}>
                {f.profileImage ? <img src={f.profileImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initialsOf(f.name)}
              </div>
              <p className="mini-contestant-card__name">{f.name}</p>
              <p className="mini-contestant-card__category">{f.category.name}</p>
              <p className="mini-contestant-card__votes">{f.level.label}</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                  type="button"
                  className="btn btn--outline mini-contestant-card__remove"
                  onClick={() => navigate('/dashboard/fan/messages', { state: { contestantId: f.id } })}
                >
                  <MessageCircle size={15} />
                  Message
                </button>
                <button type="button" className="btn btn--outline mini-contestant-card__remove" onClick={() => remove(f.id)}>
                  <Heart size={15} fill="currentColor" />
                  Unfollow
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
