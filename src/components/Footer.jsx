import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { Facebook, Instagram, Youtube, Twitter, MessageCircle, MessagesSquare } from 'lucide-react';
import './Footer.scss';

const QUICK_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Categories', to: '/categories' },
  { label: 'Contestants', to: '/contestants' },
  { label: 'Sponsors', to: '/sponsors' },
  { label: 'Events', to: '/events' },
  { label: 'Apply as a Contestant', to: '/apply' },
  { label: 'Contact Us', to: '/contact' },
];
const RESOURCES = [
  { label: 'How to Vote', to: '/how-to-vote' },
  { label: 'Community Nominations', to: '/community-nominations' },
  { label: 'Hall of Fame', to: '/hall-of-fame' },
  { label: 'Nominate Someone', to: '/nominate' },
  { label: 'Terms & Conditions', to: '/#terms' },
  { label: 'Privacy Policy', to: '/#privacy' },
  { label: 'Help Center', to: '/contact' },
];
const COUNTRIES = [
  { name: 'Rwanda', flag: '🇷🇼' },
  { name: 'Burundi', flag: '🇧🇮' },
  { name: 'Uganda', flag: '🇺🇬' },
  { name: 'Kenya', flag: '🇰🇪' },
  { name: 'Tanzania', flag: '🇹🇿' },
];

const SOCIALS = [Facebook, Instagram, MessagesSquare, Youtube, Twitter, MessageCircle];

function Newsletter() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState(null); // { tone, text }
  const [sending, setSending] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    setState(null);
    try {
      const d = await api('/newsletter/subscribe', { method: 'POST', body: { email }, auth: false });
      setState({ tone: 'ok', text: d._message });
      setEmail('');
    } catch (err) {
      setState({ tone: 'error', text: err.fieldErrors?.email || err.message });
    } finally {
      setSending(false);
    }
  };
  return (
    <>
      <form onSubmit={submit}>
        <input type="email" placeholder="Enter your email" required value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Email for the newsletter" />
        <button type="submit" className="btn btn--gold" disabled={sending}>
          {sending ? '…' : 'Subscribe'}
        </button>
      </form>
      {state && (
        <p role="status" style={{ fontSize: '0.78rem', marginTop: 8, color: state.tone === 'ok' ? '#3ec95f' : '#e0556b' }}>
          {state.text}
        </p>
      )}
    </>
  );
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <div className="footer__logo-row">
            <span className="footer__logo" aria-hidden="true">B</span>
            <div>
              <p className="footer__brand-name">BFOUNDATION.RW</p>
              <p className="footer__brand-tag">
                RECOGNIZING EXCELLENCE.<br />
                EMPOWERING POTENTIAL.
              </p>
              <p className="footer__brand-tag footer__brand-tag--green">INSPIRING RWANDA.</p>
            </div>
          </div>

          <div className="footer__socials">
            {SOCIALS.map((Icon, i) => (
              <a href="#social" key={i} aria-label="Social link">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div className="footer__col">
          <h4>Quick Links</h4>
          <ul>
            {QUICK_LINKS.map((link) => (
              <li key={link.label}><Link to={link.to}>{link.label}</Link></li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h4>Resources</h4>
          <ul>
            {RESOURCES.map((link) => (
              <li key={link.label}><Link to={link.to}>{link.label}</Link></li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h4>Countries</h4>
          <ul>
            {COUNTRIES.map((c) => (
              <li key={c.name}><span aria-hidden="true">{c.flag}</span> {c.name}</li>
            ))}
          </ul>
          <p className="footer__more">More Coming Soon...</p>
        </div>

        <div className="footer__col footer__newsletter">
          <h4>Newsletter</h4>
          <p>Subscribe to get the latest updates, news and opportunities.</p>
          <Newsletter />
        </div>
      </div>

      <div className="footer__bottom">
        <p>© {new Date().getFullYear()} BFOUNDATION.RW. All Rights Reserved.</p>
        <p>Africa&rsquo;s Digital Recognition Platform.</p>
        <label className="footer__lang">
          🌐
          <select defaultValue="en">
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="rw">Kinyarwanda</option>
          </select>
        </label>
      </div>
    </footer>
  );
}
