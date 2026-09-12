import { Star, Users, BarChart3, Users2 } from 'lucide-react';
import './StatsBar.scss';

const STATS = [
  { icon: Star, value: '24+', label: 'Award Categories', sub: '3 million up for every category' },
  { icon: Users, value: '1,250+', label: 'Contestants', sub: '3 million up for every category' },
  { icon: BarChart3, value: '250,000+', label: 'Votes Cast', sub: '3 million up for every category' },
  { icon: Users2, value: '35,000+', label: 'Community Members', sub: '3 million up for every category' },
];

export default function StatsBar() {
  return (
    <section className="stats-bar">
      <div className="stats-bar__inner">
        {STATS.map(({ icon: Icon, value, label, sub }) => (
          <div className="stats-bar__item" key={label}>
            <div className="stats-bar__icon">
              <Icon size={22} />
            </div>
            <div className="stats-bar__text">
              <p className="stats-bar__value">{value}</p>
              <p className="stats-bar__label">{label}</p>
              <p className="stats-bar__sub">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
