import { favoriteContestants } from '../fanDashboardData';

export default function FavoriteContestantsSection() {
  return (
    <div>
      <div className="dash-header">
        <h1>Favorite Contestants</h1>
        <p>Contestants you're following.</p>
      </div>

      {favoriteContestants.length === 0 ? (
        <div className="dash-empty">You haven't favorited any contestants yet.</div>
      ) : (
        <div className="dash-cards">
          {favoriteContestants.map((c) => (
            <div className="dash-card" key={c.id}>
              <h3>{c.name}</h3>
              <p>{c.category}</p>
              <small>{c.votes.toLocaleString()} votes</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
