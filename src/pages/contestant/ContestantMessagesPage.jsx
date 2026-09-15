import { useState } from 'react';
import MessagingPanel from '../../components/messaging/MessagingPanel';
import '../../components/dashboard/DashboardPage.scss';

const INITIAL_CONVERSATIONS = [
  {
    id: 1,
    name: 'Joyce Uwase',
    subtitle: 'Top supporter — 320 votes',
    unread: 1,
    messages: [
      { id: 1, from: 'them', text: "Loved your last performance! When's the new single dropping?", time: 'Yesterday' },
      { id: 2, from: 'me', text: 'Thank you Joyce! This Friday 🎵', time: 'Yesterday' },
      { id: 3, from: 'them', text: "Can't wait, already told my friends to vote!", time: '9:02 AM' },
    ],
  },
  {
    id: 2,
    name: 'Eric Niyonzima',
    subtitle: '210 votes',
    unread: 0,
    messages: [
      { id: 1, from: 'them', text: 'Just shared your voting link with my WhatsApp group!', time: 'Mon' },
      { id: 2, from: 'me', text: 'You\'re the best, thank you so much 🙏', time: 'Mon' },
    ],
  },
];

export default function ContestantMessagesPage() {
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);

  const handleSend = (conversationId, text) => {
    // TODO: send this message to your real messaging endpoint.
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              unread: 0,
              messages: [...c.messages, { id: Date.now(), from: 'me', text, time: 'Just now' }],
            }
          : c
      )
    );
  };

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Messages</h1>
          <p className="dash-page__subtitle">Reply to the fans supporting your campaign.</p>
        </div>
      </div>

      <MessagingPanel conversations={conversations} onSend={handleSend} />
    </div>
  );
}
