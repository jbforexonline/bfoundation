import { useState } from 'react';
import { Copy, Check, Facebook, Twitter, MessageCircle, Send, Link2, Percent, Share2 } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import Notice from '../../components/ui/Notice';
import useApi from '../../hooks/useApi';
import { api, formatNumber } from '../../api/client';
import '../../components/dashboard/DashboardPage.scss';
import './ContestantSharePromotePage.scss';

const CHANNELS = [
  { key: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, url: (link, text) => `https://wa.me/?text=${encodeURIComponent(`${text} ${link}`)}` },
  { key: 'facebook', label: 'Facebook', icon: Facebook, url: (link) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}` },
  { key: 'twitter', label: 'X / Twitter', icon: Twitter, url: (link, text) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(link)}` },
  { key: 'telegram', label: 'Telegram', icon: Send, url: (link, text) => `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}` },
];

export default function ContestantSharePromotePage() {
  const { data, error, reload } = useApi('/contestants/me/promo');
  const [copied, setCopied] = useState(false);

  const record = (channel) => {
    const id = data.voteUrl.split('contestant=')[1];
    api(`/contestants/${id}/share-events`, { method: 'POST', body: { type: 'share', channel } })
      .then(() => reload())
      .catch(() => {});
  };

  const copyLink = () => {
    navigator.clipboard?.writeText(data.voteUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    record('copy');
  };

  const shareTo = (channel) => {
    window.open(channel.url(data.voteUrl, data.shareText), '_blank', 'noopener,noreferrer');
    record(channel.key);
  };

  if (error) return <Notice tone="error">{error.message}</Notice>;
  if (!data) return <p style={{ color: '#a8a49b' }}>Loading…</p>;
  const s = data.stats;

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Share &amp; Promote</h1>
          <p className="dash-page__subtitle">Get your voting link in front of more fans.</p>
        </div>
      </div>

      <div className="dash-page__stats" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <StatCard icon={Link2} label="Link Clicks" value={formatNumber(s.linkClicks)} sub={`${formatNumber(s.uniqueVisitors)} different visitors`} />
        <StatCard icon={Share2} label="Shares" value={formatNumber(s.shares)} sub={Object.entries(s.sharesByChannel).map(([k, v]) => `${k} ${v}`).join(' · ') || 'Share below to start'} />
        <StatCard icon={Percent} label="Votes via your link" value={`${s.votesFromLinkPercent}%`} sub="of all your votes" />
        <StatCard icon={Check} label="Click → vote" value={`${s.clickToVotePercent}%`} sub="of visitors voted" />
      </div>

      <div className="share-promote__panel">
        <h2 className="dash-page__section-title">Your voting link</h2>
        <div className="share-promote__link-row">
          <input type="text" readOnly value={data.voteUrl} onFocus={(e) => e.target.select()} />
          <button type="button" className="btn btn--gold" onClick={copyLink}>
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        <h2 className="dash-page__section-title" style={{ marginTop: 24 }}>Share directly</h2>
        <div className="share-promote__channels">
          {CHANNELS.map((c) => (
            <button type="button" key={c.key} className="share-promote__channel" onClick={() => shareTo(c)}>
              <c.icon size={18} />
              {c.label}
            </button>
          ))}
        </div>
        <p style={{ color: '#a8a49b', fontSize: '0.8rem', marginTop: 16 }}>Message used when sharing: “{data.shareText}”</p>
      </div>
    </div>
  );
}
