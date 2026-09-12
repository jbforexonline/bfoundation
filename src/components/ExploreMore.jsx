import { Link } from 'react-router-dom';
import {
  Users, LayoutGrid, Handshake, CalendarDays,
  ClipboardList, Info, Megaphone, ArrowRight,
} from 'lucide-react';
import './ExploreMore.scss';

const LINKS = [
  { icon: Users, label: 'Contestants', desc: "Browse this month's contestants", to: '/contestants' },
  { icon: LayoutGrid, label: 'Categories', desc: '24+ categories to explore', to: '/categories' },
  { icon: Handshake, label: 'Sponsors', desc: 'The partners behind BFOUNDATION', to: '/sponsors' },
  { icon: CalendarDays, label: 'Events', desc: 'Upcoming shows and the Awards Night', to: '/events' },
  { icon: ClipboardList, label: 'Apply as a Contestant', desc: 'Enter a category and compete', to: '/apply' },
  { icon: Info, label: 'About Us', desc: 'Our story and our values', to: '/about' },
  { icon: Megaphone, label: 'Community Nominations', desc: 'Suggested and supported by fans', to: '/community-nominations' },
];

export default function ExploreMore() {
  return (
    <section className="explore-more section">
      <div className="explore-more__inner">
        <h2 className="explore-more__title">Explore BFOUNDATION</h2>
        <div className="explore-more__grid">
          {LINKS.map(({ icon: Icon, label, desc, to }) => (
            <Link to={to} className="explore-more__card" key={to}>
              <div className="explore-more__icon">
                <Icon size={22} />
              </div>
              <div className="explore-more__text">
                <p className="explore-more__label">{label}</p>
                <p className="explore-more__desc">{desc}</p>
              </div>
              <ArrowRight size={16} className="explore-more__arrow" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
