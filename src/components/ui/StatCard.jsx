import './StatCard.scss';

export default function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="stat-card">
      {Icon && (
        <div className="stat-card__icon">
          <Icon size={20} />
        </div>
      )}
      <div className="stat-card__text">
        <p className="stat-card__value">{value}</p>
        <p className="stat-card__label">{label}</p>
        {sub && <p className="stat-card__sub">{sub}</p>}
      </div>
    </div>
  );
}
