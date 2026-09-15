import { useState } from 'react';
import { Copy, Check, ExternalLink, QrCode, Vote } from 'lucide-react';
import '../../components/dashboard/DashboardPage.scss';
import './ContestantVotingPagePage.scss';

const VOTE_URL = 'https://bfoundation.rw/vote/malaika-uwase';

export default function ContestantVotingPagePage() {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    // navigator.clipboard requires a secure context; this is best-effort for the demo.
    navigator.clipboard?.writeText(VOTE_URL).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Voting Page</h1>
          <p className="dash-page__subtitle">Your public voting page — this is what fans see when they vote for you.</p>
        </div>
      </div>

      <div className="voting-page__grid">
        <div className="voting-page__preview">
          <div className="voting-page__preview-avatar">MU</div>
          <p className="voting-page__preview-name">Malaika Uwase</p>
          <p className="voting-page__preview-category">Best Musician</p>
          <p className="voting-page__preview-votes">18,420 votes</p>
          <button type="button" className="btn btn--gold" disabled style={{ width: '100%' }}>
            <Vote size={15} /> Vote Now
          </button>
          <p className="voting-page__preview-note">Preview only — fans vote from the live site.</p>
        </div>

        <div className="voting-page__share">
          <h2 className="dash-page__section-title">Share your voting link</h2>

          <div className="voting-page__link-row">
            <input type="text" readOnly value={VOTE_URL} />
            <button type="button" className="btn btn--gold" onClick={copyLink}>
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          <a href={VOTE_URL} target="_blank" rel="noreferrer" className="voting-page__external">
            <ExternalLink size={14} /> Open public voting page
          </a>

          <div className="voting-page__qr">
            <QrCode size={64} />
            <p>Scan to vote — great for flyers, stories, and in-person events.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
