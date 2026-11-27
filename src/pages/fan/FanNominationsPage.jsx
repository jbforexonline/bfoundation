import { Link } from 'react-router-dom';
import { Megaphone, HeartHandshake } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Notice from '../../components/ui/Notice';
import useApi from '../../hooks/useApi';
import { formatDate } from '../../api/client';
import '../../components/dashboard/DashboardPage.scss';

const STATUS = {
  PENDING: ['warning', 'Collecting support'],
  QUALIFIED_FOR_REVIEW: ['gold', 'Under review'],
  APPROVED: ['success', 'Official Nominee'],
  REJECTED: ['danger', 'Not approved'],
};

function NominationRow({ n, extra }) {
  const [tone, label] = STATUS[n.status] ?? ['neutral', n.status];
  const progress = Math.min(100, Math.round((n.supporters / n.threshold) * 100));
  return (
    <div className="dash-item">
      <div className="dash-item__icon">
        <Megaphone size={18} />
      </div>
      <div className="dash-item__body">
        <p className="dash-item__title">
          {n.nomineeName} · {n.category.name}
        </p>
        <p className="dash-item__meta">
          {n.supporters} / {n.threshold} supports · nominated {formatDate(n.createdAt)}
          {extra ? ` · ${extra}` : ''}
        </p>
        {n.status === 'PENDING' && (
          <div style={{ height: 6, background: '#2a2620', borderRadius: 4, marginTop: 8, maxWidth: 320 }}>
            <div style={{ width: `${progress}%`, height: '100%', background: '#f0a93a', borderRadius: 4 }} />
          </div>
        )}
      </div>
      <Badge tone={tone}>{label}</Badge>
    </div>
  );
}

// Fan dashboard: nominations I submitted and the ones I supported.
export default function FanNominationsPage() {
  const mine = useApi('/nominations/mine', { limit: 50 });
  const supported = useApi('/nominations/supported');
  const myList = mine.data?.nominations ?? [];
  const supportedList = supported.data?.nominations ?? [];

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">My Nominations</h1>
          <p className="dash-page__subtitle">People you nominated and the community nominations you support.</p>
        </div>
        <Link to="/nominate" className="btn btn--gold">
          <Megaphone size={16} /> Nominate someone
        </Link>
      </div>

      <Notice tone="error">{mine.error?.message || supported.error?.message}</Notice>

      <h2 className="dash-page__section-title">Nominated by me</h2>
      {mine.loading && !mine.data ? (
        <p style={{ color: '#a8a49b' }}>Loading…</p>
      ) : myList.length === 0 ? (
        <p style={{ color: '#a8a49b' }}>You haven&rsquo;t nominated anyone yet.</p>
      ) : (
        <div className="dash-page__list">
          {myList.map((n) => (
            <NominationRow key={n.id} n={n} />
          ))}
        </div>
      )}

      <h2 className="dash-page__section-title" style={{ marginTop: 28 }}>
        <HeartHandshake size={16} style={{ verticalAlign: -3, marginRight: 6 }} />
        Supported by me
      </h2>
      {supported.loading && !supported.data ? (
        <p style={{ color: '#a8a49b' }}>Loading…</p>
      ) : supportedList.length === 0 ? (
        <p style={{ color: '#a8a49b' }}>
          You haven&rsquo;t supported a nomination yet. See the{' '}
          <Link to="/community-nominations" style={{ color: '#f0a93a' }}>community nominations</Link>.
        </p>
      ) : (
        <div className="dash-page__list">
          {supportedList.map((s) => (
            <NominationRow key={s.nomination.id} n={s.nomination} extra={`you supported ${formatDate(s.lastSupportedAt)}`} />
          ))}
        </div>
      )}
    </div>
  );
}
