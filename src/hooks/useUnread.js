import { useEffect, useState } from 'react';
import { api } from '../api/client';

// Unread notifications and messages for the dashboard bell / menu badges. Polls every 30 s
// and refreshes right away when a page fires the "bf:unread" event (after marking things read).
export default function useUnread(user) {
  const [counts, setCounts] = useState({ notifications: 0, messages: 0 });
  const role = user?.role;

  useEffect(() => {
    if (!role) return undefined;
    let alive = true;
    const load = async () => {
      try {
        const n = await api('/notifications/unread-count');
        const m = role === 'FAN' || role === 'CONTESTANT' ? await api('/messages/unread-count') : { unread: 0 };
        if (alive) setCounts({ notifications: n.unread, messages: m.unread });
      } catch {
        /* offline or logged out: keep the last numbers */
      }
    };
    load();
    const timer = setInterval(load, 30000);
    window.addEventListener('bf:unread', load);
    return () => {
      alive = false;
      clearInterval(timer);
      window.removeEventListener('bf:unread', load);
    };
  }, [role]);

  return counts;
}

// Call after marking notifications / messages as read so the badges update immediately.
export const refreshUnread = () => window.dispatchEvent(new Event('bf:unread'));
