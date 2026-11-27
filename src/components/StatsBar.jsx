import { Star, Users, BarChart3, Users2 } from 'lucide-react';
import useApi from '../hooks/useApi';
import './StatsBar.scss';

// "12,345" → "12,000+"; small numbers stay exact.
function rounded(n) {
  if (n === undefined || n === null) return '—';
  if (n < 100) return String(n);
  const step = n < 1000 ? 50 : n < 10000 ? 500 : n < 100000 ? 1000 : 10000;
  return `${(Math.floor(n / step) * step).toLocaleString('en-US')}+`;
}

// Live platform totals from the API (cached for a minute on the server).
export default function StatsBar() {
  const { data } = useApi('/stats/public');
  const prize = data?.prizePerCategoryRwf ? `${(data.prizePerCategoryRwf / 1_000_000).toLocaleString('en-US')} million RWF up for every category` : 'Monthly awards';
  const stats = [
    { icon: Star, value: rounded(data?.categories), label: 'Award Categories', sub: prize },
    { icon: Users, value: rounded(data?.contestants), label: 'Contestants', sub: 'Competing right now' },
    { icon: BarChart3, value: rounded(data?.votesCast), label: 'Votes Cast', sub: 'By fans across the region' },
    { icon: Users2, value: rounded(data?.members), label: 'Community Members', sub: 'Fans and contestants' },
  ];

  return (
    <section className="stats-bar">
      <div className="stats-bar__inner">
        {stats.map(({ icon: Icon, value, label, sub }) => (
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
