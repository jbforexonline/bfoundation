import { useState } from 'react';
import { Send } from 'lucide-react';
import './MessagingPanel.scss';

function initials(name) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

/**
 * Shared two-pane messaging UI for the Fan and Contestant dashboards.
 * conversations: [{ id, name, subtitle?, unread, messages: [{ id, from: 'me'|'them', text, time }] }]
 * onSend(conversationId, text) — called when the user sends a message.
 */
export default function MessagingPanel({ conversations, onSend, initialActiveId, emptyLabel = 'No conversations yet.' }) {
  const [activeId, setActiveId] = useState(initialActiveId ?? conversations[0]?.id ?? null);
  const [draft, setDraft] = useState('');

  const active = conversations.find((c) => c.id === activeId);

  const handleSend = (e) => {
    e.preventDefault();
    if (!draft.trim() || !active) return;
    onSend(active.id, draft.trim());
    setDraft('');
  };

  if (conversations.length === 0) {
    return <p style={{ color: '#78746c' }}>{emptyLabel}</p>;
  }

  return (
    <div className="messaging">
      <div className="messaging__list">
        {conversations.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`messaging__item ${c.id === activeId ? 'is-active' : ''}`}
            onClick={() => setActiveId(c.id)}
          >
            <span className="messaging__avatar">{initials(c.name)}</span>
            <span className="messaging__item-text">
              <span className="messaging__item-name">{c.name}</span>
              <span className="messaging__item-preview">
                {c.messages[c.messages.length - 1]?.text ?? c.subtitle ?? ''}
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
              <span className="messaging__avatar">{initials(active.name)}</span>
              <div>
                <p className="messaging__thread-name">{active.name}</p>
                {active.subtitle && <p className="messaging__thread-subtitle">{active.subtitle}</p>}
              </div>
            </div>

            <div className="messaging__messages">
              {active.messages.map((m) => (
                <div key={m.id} className={`messaging__bubble messaging__bubble--${m.from}`}>
                  <p>{m.text}</p>
                  <span>{m.time}</span>
                </div>
              ))}
            </div>

            <form className="messaging__composer" onSubmit={handleSend}>
              <input
                type="text"
                placeholder="Write a message..."
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
              <button type="submit" aria-label="Send message">
                <Send size={16} />
              </button>
            </form>
          </>
        ) : (
          <p style={{ color: '#78746c', padding: 24 }}>Select a conversation.</p>
        )}
      </div>
    </div>
  );
}
