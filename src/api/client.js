// Small API client for the BFOUNDATION.RW backend.
// Base URL comes from VITE_API_URL (set at build time), e.g. https://api.bfoundation.rw/api/v1
export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1').replace(/\/$/, '');

const SESSION_KEY = 'bf_session';

// ─── Session (tokens + user) kept in localStorage ───
export const session = {
  get() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
    } catch {
      return null;
    }
  },
  set(value) {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(value));
    } catch {
      /* storage unavailable */
    }
    window.dispatchEvent(new Event('bf:session'));
  },
  update(patch) {
    const current = session.get();
    if (current) session.set({ ...current, ...patch });
  },
  clear() {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      /* storage unavailable */
    }
    window.dispatchEvent(new Event('bf:session'));
  },
};

// Error thrown for every non-2xx answer. `fieldErrors` maps form fields to messages.
export class ApiError extends Error {
  constructor(status, body) {
    super(body?.message || (status === 0 ? 'Cannot reach the server. Check your connection.' : 'Something went wrong.'));
    this.status = status;
    this.code = body?.code;
    this.errors = body?.errors || [];
    this.fieldErrors = Object.fromEntries(this.errors.filter((e) => e.field).map((e) => [e.field, e.message]));
  }
}

let refreshing = null;

async function refreshTokens() {
  const current = session.get();
  if (!current?.refreshToken) throw new ApiError(401, { message: 'Please log in again.' });
  refreshing ??= fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: current.refreshToken }),
  })
    .then(async (res) => {
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new ApiError(res.status, body);
      session.set({ ...current, accessToken: body.data.accessToken, refreshToken: body.data.refreshToken, user: body.data.user ?? current.user });
    })
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}

/**
 * api('/categories')
 * api('/auth/login', { method: 'POST', body: {...} })
 * api('/contestants/me/media', { method: 'POST', form: formData })
 * Returns the `data` part of the response envelope ({ success, message, data }); `message` is attached as `_message`.
 */
export async function api(path, { method = 'GET', body, form, query, auth = true, retry = true } = {}) {
  const url = new URL(`${API_URL}${path}`);
  if (query) {
    for (const [k, v] of Object.entries(query)) if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v);
  }
  const headers = { Accept: 'application/json' };
  const token = session.get()?.accessToken;
  if (auth && token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  let res;
  try {
    res = await fetch(url, { method, headers, body: form ?? (body !== undefined ? JSON.stringify(body) : undefined) });
  } catch {
    throw new ApiError(0, null);
  }
  const json = await res.json().catch(() => null);

  if (res.status === 401 && auth && token && retry && json?.code === 'TOKEN_EXPIRED') {
    try {
      await refreshTokens();
    } catch {
      session.clear();
      throw new ApiError(401, { message: 'Your session expired. Please log in again.', code: 'SESSION_EXPIRED' });
    }
    return api(path, { method, body, form, query, auth, retry: false });
  }
  if (!res.ok) throw new ApiError(res.status, json);
  const data = json?.data ?? {};
  if (data && typeof data === 'object') Object.defineProperty(data, '_message', { value: json?.message, enumerable: false });
  return data;
}

// "3000000" → "3,000,000 RWF"
export const formatRwf = (n) => (n === 0 ? 'Free' : `${Number(n || 0).toLocaleString('en-US')} RWF`);
export const formatDate = (d, opts = { year: 'numeric', month: 'short', day: 'numeric' }) =>
  d ? new Date(d).toLocaleDateString('en-US', opts) : '—';
export const formatDateTime = (d) =>
  d ? new Date(d).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';
export const titleCase = (s) => (s ? s.charAt(0) + s.slice(1).toLowerCase().replace(/_/g, ' ') : '');

// "5 minutes ago", "Yesterday", "Mar 4"
export function timeAgo(d) {
  if (!d) return '';
  const diff = (Date.now() - new Date(d).getTime()) / 1000;
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hour${diff < 7200 ? '' : 's'} ago`;
  if (diff < 172800) return 'Yesterday';
  if (diff < 7 * 86400) return `${Math.floor(diff / 86400)} days ago`;
  return formatDate(d);
}

export const initialsOf = (name = '') =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

// 1234 → "1,234"
export const formatNumber = (n) => Number(n || 0).toLocaleString('en-US');

// Downloads a protected file (e.g. promo graphics) with the user's token, then saves it.
export async function downloadFile(path, fallbackName = 'download') {
  const send = () =>
    fetch(`${API_URL}${path}`, { headers: { Authorization: `Bearer ${session.get()?.accessToken ?? ''}` } });
  let res = await send();
  if (res.status === 401) {
    await refreshTokens();
    res = await send();
  }
  if (!res.ok) throw new ApiError(res.status, await res.json().catch(() => null));
  const name = /filename="([^"]+)"/.exec(res.headers.get('content-disposition') ?? '')?.[1] ?? fallbackName;
  const url = URL.createObjectURL(await res.blob());
  const a = Object.assign(document.createElement('a'), { href: url, download: name });
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Website traffic for the admin Analytics page. Fire-and-forget; never breaks navigation.
export function trackPageView(path) {
  try {
    let sid = sessionStorage.getItem('bf_sid');
    if (!sid) {
      sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem('bf_sid', sid);
    }
    const token = session.get()?.accessToken;
    fetch(`${API_URL}/analytics/pageview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ path, sessionId: sid, referrer: document.referrer || undefined }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* ignore */
  }
}
