import './Badge.scss';

// tone: 'success' | 'warning' | 'danger' | 'neutral' | 'gold'
export default function Badge({ tone = 'neutral', children }) {
  return <span className={`badge badge--${tone}`}>{children}</span>;
}
