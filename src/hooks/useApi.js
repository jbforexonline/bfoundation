import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../api/client';

// Loads `path` (with `query`) on mount and whenever they change.
// Returns { data, error, loading, reload }. Pass path = null to skip.
export default function useApi(path, query) {
  const [state, setState] = useState({ data: null, error: null, loading: Boolean(path) });
  const key = path ? `${path}?${JSON.stringify(query ?? {})}` : null;
  const latest = useRef(0);

  const load = useCallback(async () => {
    if (!path) return;
    const id = ++latest.current;
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await api(path, { query });
      if (id === latest.current) setState({ data, error: null, loading: false });
    } catch (error) {
      if (id === latest.current) setState((s) => ({ ...s, error, loading: false }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, reload: load };
}
