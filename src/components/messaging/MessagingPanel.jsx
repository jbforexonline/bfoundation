import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Send } from 'lucide-react';
import Notice from '../ui/Notice';
import { api, initialsOf, timeAgo } from '../../api/client';
import { refreshUnread } from '../../hooks/useUnread';
import './MessagingPanel.scss';

const Avatar = ({ person }) => (
  <span className="messaging__avatar">{person?.avatar ? <img src={person.avatar} alt="" /> : initialsOf(person?.name)}</span>
);

/**
 * Two-pane messaging for the Fan and Contestant dashboards, connected to /messages.
 * Opens ?c=<conversationId> (links in notifications), or starts a conversation with
 * the contestant passed as location.state.contestantId (the "Message" button on the fan side).
 */
export default function MessagingPanel({ emptyLabel = 'No conversations yet.' }) {
  const [params, setParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(params.get('c'));
  const [thread, setThread] = useState({ conversation: null, messages: [] });
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottom = useRef(null);

  const loadList = useCallback(async () => {
    const d = await api('/messages/conversations');
    setConversations(d.conversations);
    return d.conversations;
  }, []);

  const loadThread = useCallback(async (id) => {
    if (!id) return;
    const d = await api(`/messages/conversations/${id}`);
    setThread(d);
    refreshUnread();
  }, []);

  // First load: list, plus "start a conversation with X" from the Contestants page.
  useEffect(() => {
    (async () => {
      try {
        const startWith = location.state?.contestantId;
        let id = params.get('c');
        if (startWith) {
          const d = await api('/messages/conversations', { method: 'POST', body: { contestantId: startWith } });
          id = d.conversation.id;
          setThread({ conversation: d.conversation, messages: [] });
          navigate(location.pathname, { replace: true, state: null }); // don't restart on refresh
        }
        const list = await loadList();
        const chosen = id ?? list[0]?.id ?? null;
        setActiveId(chosen);
        if (chosen) await loadThread(chosen);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // New messages arrive while the page is open.
  useEffect(() => {
    const timer = setInterval(() => {
      loadList().catch(() => {});
      if (activeId) loadThread(activeId).catch(() => {});
    }, 15000);
    return () => clearInterval(timer);
  }, [activeId, loadList, loadThread]);

  useEffect(() => {
    bottom.current?.scrollIntoView({ block: 'end' });
  }, [thread.messages.length]);

  const select = async (id) => {
    setActiveId(id);
    setError('');
    setParams(id ? { c: id } : {}, { replace: true });
    try {
      await loadThread(id);
      await loadList();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !activeId || sending) return;
    setSending(true);
    setError('');
    try {
      const d = await api(`/messages/conversations/${activeId}/messages`, { method: 'POST', body: { body: text } });
      setThread((t) => ({ ...t, messages: [...t.messages, d.message] }));
      setDraft('');
      loadList().catch(() => {});
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  // A conversation just started (no messages yet) isn't in the list: show it on top.
  const list =
    thread.conversation && !conversations.some((c) => c.id === thread.conversation.id)
      ? [{ ...thread.conversation, lastMessage: null, unread: 0 }, ...conversations]
      : conversations;
  const active = list.find((c) => c.id === activeId);

  if (loading) return <p style={{ color: '#a8a49b' }}>Loading messages…</p>;

  return (
    <>
      <Notice tone="error">{error}</Notice>
      {list.length === 0 ? (
        <p style={{ color: '#78746c' }}>{emptyLabel}</p>
      ) : (
        <div className="messaging">
          <div className="messaging__list">
            {list.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`messaging__item ${c.id === activeId ? 'is-active' : ''}`}
                onClick={() => select(c.id)}
              >
                <Avatar person={c.with} />
                <span className="messaging__item-text">
                  <span className="messaging__item-name">{c.with.name}</span>
                  <span className="messaging__item-preview">
                    {c.lastMessage ? `${c.lastMessage.fromMe ? 'You: ' : ''}${c.lastMessage.body}` : c.with.subtitle}
                  </span>
                </span>
                {c.unread > 0 && <span className="messaging__badge">{c.unread}</span>}
              </button>
            ))}
          </div>

          <div className="messaging__thread">
            {active ? (
              <>
                <div className="messaging__thread-header">
                  <Avatar person={active.with} />
                  <div>
                    <p className="messaging__thread-name">{active.with.name}</p>
                    <p className="messaging__thread-subtitle">
                      {active.with.subtitle}
                      {active.with.level ? ` · ${active.with.level.label}` : ''}
                    </p>
                  </div>
                </div>
                <div className="messaging__messages">
                  {thread.messages.length === 0 && (
                    <p style={{ color: '#78746c', fontSize: '0.85rem', textAlign: 'center', marginTop: 24 }}>
                      Say hello to {active.with.name.split(' ')[0]}!
                    </p>
                  )}
                  {thread.messages.map((m) => (
                    <div key={m.id} className={`messaging__bubble messaging__bubble--${m.fromMe ? 'me' : 'them'}`}>
                      <p>{m.body}</p>
                      <span>{timeAgo(m.createdAt)}</span>
                    </div>
                  ))}
                  <div ref={bottom} />
                </div>
                <form className="messaging__composer" onSubmit={handleSend}>
                  <input
                    type="text"
                    placeholder="Write a message..."
                    value={draft}
                    maxLength={2000}
                    onChange={(e) => setDraft(e.target.value)}
                  />
                  <button type="submit" aria-label="Send message" disabled={sending || !draft.trim()}>
                    <Send size={16} />
                  </button>
                </form>
              </>
            ) : (
              <p style={{ color: '#78746c', padding: 24 }}>Select a conversation.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
