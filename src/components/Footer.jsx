import { Link } from 'react-router-dom';
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
  { label: 'Fan Dashboard (demo)', to: '/dashboard/fan/profile' },
  { label: 'Contestant Dashboard (demo)', to: '/dashboard/contestant/profile' },
  { label: 'Admin Dashboard (demo)', to: '/dashboard/admin/contestants' },
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
          <form onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your email" required />
            <button type="submit" className="btn btn--gold">Subscribe</button>
          </form>
        </div>
      </div>

      <div className="footer__bottom">
        <p>© 2025 BFOUNDATION.RW. All Rights Reserved.</p>
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
