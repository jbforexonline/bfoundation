import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import MessagingPanel from '../../components/messaging/MessagingPanel';
import '../../components/dashboard/DashboardPage.scss';

const INITIAL_CONVERSATIONS = [
  {
    id: 1,
    name: 'Malaika Uwase',
    subtitle: 'Best Musician',
    unread: 1,
    messages: [
      { id: 1, from: 'them', text: 'Thank you so much for your votes this week!', time: 'Yesterday' },
      { id: 2, from: 'me', text: "You deserve it! Can't wait for the new single.", time: 'Yesterday' },
      { id: 3, from: 'them', text: "It drops Friday — I'll share a preview here first 🎵", time: '9:14 AM' },
    ],
  },
  {
    id: 2,
    name: 'Ishimwe Kevin',
    subtitle: 'Best Footballer',
    unread: 0,
    messages: [
      { id: 1, from: 'me', text: 'Good luck this weekend! Voted for you already 🙌', time: 'Mon' },
      { id: 2, from: 'them', text: 'Means a lot, thank you for the support!', time: 'Mon' },
    ],
  },
  {
    id: 3,
    name: 'Grace Umutoni',
    subtitle: 'Best Influencer',
    unread: 0,
    messages: [
      { id: 1, from: 'them', text: 'New campaign post is up — check it out!', time: 'Last week' },
    ],
  },
  {
    id: 4,
    name: 'Divine Ingabire',
    subtitle: 'Best Comedian',
    unread: 0,
    messages: [
      { id: 1, from: 'me', text: 'Your set at the Musanze showcase was hilarious 😂', time: '2 weeks ago' },
      { id: 2, from: 'them', text: 'Haha thank you! More coming soon.', time: '2 weeks ago' },
    ],
  },
];

export default function FanMessagesPage() {
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const location = useLocation();
  const openName = location.state?.openName;
  const initialActiveId = openName
    ? conversations.find((c) => c.name === openName)?.id
    : undefined;

  const handleSend = (conversationId, text) => {
    // TODO: send this message to your real messaging endpoint.
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              unread: 0,
              messages: [
                ...c.messages,
                { id: Date.now(), from: 'me', text, time: 'Just now' },
              ],
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
          <p className="dash-page__subtitle">Chat directly with the contestants you support.</p>
        </div>
      </div>

      <MessagingPanel conversations={conversations} onSend={handleSend} initialActiveId={initialActiveId} />
    </div>
  );
}
