import { useState } from 'react';
import { Copy, Check, ExternalLink, Download, Vote, BadgeCheck } from 'lucide-react';
import Notice from '../../components/ui/Notice';
import useApi from '../../hooks/useApi';
import { api, downloadFile, initialsOf } from '../../api/client';
import '../../components/dashboard/DashboardPage.scss';
import './ContestantVotingPagePage.scss';

// The contestant's public voting link (/vote?contestant=<id>) with a preview and its QR code.
export default function ContestantVotingPagePage() {
  const { data, error } = useApi('/contestants/me/promo');
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState('');

  const copyLink = () => {
    navigator.clipboard?.writeText(data.voteUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    api(`/contestants/${data.voteUrl.split('contestant=')[1]}/share-events`, { method: 'POST', body: { type: 'share', channel: 'copy' } }).catch(() => {});
  };

  const downloadQr = async () => {
    setNotice('');
    try {
      await downloadFile('/contestants/me/promo/qr.png', 'voting-qr.png');
    } catch (err) {
      setNotice(err.message);
    }
  };

  if (error) return <Notice tone="error">{error.message}</Notice>;
  if (!data) return <p style={{ color: '#a8a49b' }}>Loading…</p>;
  const p = data.profile;

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Voting Page</h1>
          <p className="dash-page__subtitle">Your public voting page — this is what fans see when they vote for you.</p>
        </div>
      </div>

      <Notice tone="error">{notice}</Notice>

      <div className="voting-page__grid">
        <div className="voting-page__preview">
          <div className="voting-page__preview-avatar" style={p.profileImage ? { padding: 0, overflow: 'hidden' } : undefined}>
            {p.profileImage ? <img src={p.profileImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initialsOf(p.name)}
          </div>
          <p className="voting-page__preview-name">
            {p.name} {p.verified && <BadgeCheck size={15} style={{ color: '#f0a93a', verticalAlign: -2 }} />}
          </p>
          <p className="voting-page__preview-category">{p.category}</p>
          <p className="voting-page__preview-votes">{p.level.label}</p>
          <button type="button" className="btn btn--gold" disabled style={{ width: '100%' }}>
            <Vote size={15} /> Vote Now
          </button>
          <p className="voting-page__preview-note">Preview only — fans see your level badge, never vote numbers.</p>
        </div>

        <div className="voting-page__share">
          <h2 className="dash-page__section-title">Share your voting link</h2>
          <div className="voting-page__link-row">
            <input type="text" readOnly value={data.voteUrl} onFocus={(e) => e.target.select()} />
            <button type="button" className="btn btn--gold" onClick={copyLink}>
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <a href={data.voteUrl} target="_blank" rel="noreferrer" className="voting-page__external">
            <ExternalLink size={14} /> Open public voting page
          </a>
          <div className="voting-page__qr">
            <img src={data.qrCode} alt="QR code of your voting link" style={{ width: 140, height: 140, background: '#fff', borderRadius: 8, padding: 6 }} />
            <div>
              <p>Scan to vote — great for flyers, stories, and in-person events.</p>
              <button type="button" className="btn btn--outline" style={{ marginTop: 10, padding: '6px 12px', fontSize: '0.8rem' }} onClick={downloadQr}>
                <Download size={14} /> Download QR (PNG)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
