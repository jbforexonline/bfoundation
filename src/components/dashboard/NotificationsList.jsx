import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell, Vote, Trophy, Ticket, Megaphone, Heart, MessageCircle, BadgeCheck, Gift, UserCheck, Star, Trash2,
} from 'lucide-react';
import Notice from '../ui/Notice';
import useApi from '../../hooks/useApi';
import { refreshUnread } from '../../hooks/useUnread';
import { api, timeAgo } from '../../api/client';
import './DashboardPage.scss';

// Icon per notification type (sent by the backend).
const ICONS = {
  NEW_FOLLOWER: Heart,
  NEW_MESSAGE: MessageCircle,
  NEW_POST: Megaphone,
  POST_COMMENT: MessageCircle,
  LEVEL_UP: Trophy,
  APPLICATION_APPROVED: UserCheck,
  VERIFIED: BadgeCheck,
  PROFILE_STATUS: Star,
  TICKET_CONFIRMED: Ticket,
  NOMINATION_QUALIFIED: Vote,
  NOMINATION_DECISION: Vote,
  REFERRAL_REWARD: Gift,
  ANNOUNCEMENT: Megaphone,
};

/** The Notifications page of the fan and contestant dashboards. */
export default function NotificationsList({ subtitle }) {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { data, error, loading, reload } = useApi('/notifications', { page, limit: 20 });
  const [actionError, setActionError] = useState('');
  const items = data?.notifications ?? [];
  const pages = data?.pagination?.totalPages ?? 1;

  const run = async (fn) => {
    setActionError('');
    try {
      await fn();
      await reload();
      refreshUnread();
    } catch (err) {
      setActionError(err.message);
    }
  };

  const open = (n) =>
    run(async () => {
      if (!n.read) await api(`/notifications/${n.id}/read`, { method: 'PATCH' });
      if (n.link) navigate(n.link);
    });

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Notifications</h1>
          <p className="dash-page__subtitle">{subtitle}</p>
        </div>
        {data?.unread > 0 && (
          <button type="button" className="btn btn--outline" onClick={() => run(() => api('/notifications/read-all', { method: 'POST' }))}>
            Mark all as read
          </button>
        )}
      </div>

      <Notice tone="error">{error?.message || actionError}</Notice>

      {loading && !data ? (
        <p style={{ color: '#a8a49b' }}>Loading notifications…</p>
      ) : items.length === 0 ? (
        <p style={{ color: '#a8a49b' }}>No notifications yet. We&rsquo;ll let you know when something happens.</p>
      ) : (
        <div className="dash-page__list">
          {items.map((n) => {
            const Icon = ICONS[n.type] ?? Bell;
            return (
              <div className={`dash-item ${n.read ? '' : 'dash-item--unread'}`} key={n.id}>
                <div className="dash-item__icon">
                  <Icon size={18} />
                </div>
                <div className="dash-item__body" style={{ cursor: n.link ? 'pointer' : 'default' }} onClick={() => open(n)}>
                  <p className="dash-item__title">{n.title}</p>
                  {n.message && <p className="dash-item__meta" style={{ color: '#cfcac0' }}>{n.message}</p>}
                  <p className="dash-item__meta">{timeAgo(n.createdAt)}</p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {!n.read && (
                    <button
                      type="button"
                      className="btn btn--outline dash-item__action"
                      onClick={() => run(() => api(`/notifications/${n.id}/read`, { method: 'PATCH' }))}
                    >
                      <Bell size={14} />
                      Mark read
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn--outline dash-item__action"
                    aria-label="Delete notification"
                    onClick={() => run(() => api(`/notifications/${n.id}`, { method: 'DELETE' }))}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {pages > 1 && (
        <div style={{ display: 'flex', gap: 8, marginTop: 16, alignItems: 'center' }}>
          <button type="button" className="btn btn--outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </button>
          <span style={{ color: '#a8a49b', fontSize: '0.85rem' }}>
            Page {page} of {pages}
          </span>
          <button type="button" className="btn btn--outline" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}
