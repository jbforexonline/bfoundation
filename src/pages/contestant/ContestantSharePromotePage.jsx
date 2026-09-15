import { useState } from 'react';
import { Copy, Check, Facebook, Twitter, MessageCircle, Send, Link2 } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import '../../components/dashboard/DashboardPage.scss';
import './ContestantSharePromotePage.scss';

const SHARE_URL = 'https://bfoundation.rw/vote/malaika-uwase';

const CHANNELS = [
  { key: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
  { key: 'facebook', label: 'Facebook', icon: Facebook },
  { key: 'twitter', label: 'X / Twitter', icon: Twitter },
  { key: 'telegram', label: 'Telegram', icon: Send },
];

export default function ContestantSharePromotePage() {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard?.writeText(SHARE_URL).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareTo = (channel) => {
    // TODO: replace with real share intents (e.g. https://wa.me/?text=...).
    console.log('Share to', channel, SHARE_URL);
  };

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Share &amp; Promote</h1>
          <p className="dash-page__subtitle">Get your voting link in front of more fans.</p>
        </div>
      </div>

      <div className="dash-page__stats">
        <StatCard icon={Link2} label="Link Clicks" value="4,210" sub="This cycle" />
        <StatCard icon={Send} label="Shares Sent" value="612" />
        <StatCard icon={Check} label="Votes via Referral" value="3,100" sub="38% conversion" />
      </div>

      <div className="share-promote__panel">
        <h2 className="dash-page__section-title">Your voting link</h2>
        <div className="share-promote__link-row">
          <input type="text" readOnly value={SHARE_URL} />
          <button type="button" className="btn btn--gold" onClick={copyLink}>
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        <h2 className="dash-page__section-title" style={{ marginTop: 24 }}>Share directly</h2>
        <div className="share-promote__channels">
          {CHANNELS.map(({ key, label, icon: Icon }) => (
            <button type="button" key={key} className="share-promote__channel" onClick={() => shareTo(key)}>
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
