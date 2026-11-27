import { Link } from 'react-router-dom';
import {
  Music2, PlaySquare, Music, Smile, PenLine, Star,
  CircleDot, PersonStanding, Headphones, Video, ArrowRight, Award,
} from 'lucide-react';
import useApi from '../hooks/useApi';
import { formatRwf } from '../api/client';
import './Categories.scss';

// Icon by category name; anything new gets the award icon.
const ICONS = {
  'best tiktoker': Music2,
  'best youtuber': PlaySquare,
  'best musician': Music,
  'best comedian': Smile,
  'best journalist': PenLine,
  'best influencer': Star,
  'best footballer': CircleDot,
  'best dancer': PersonStanding,
  'best dj': Headphones,
  'best actor': Video,
};

export default function Categories() {
  const { data } = useApi('/categories');
  const categories = (data?.categories ?? []).slice(0, 10);

  return (
    <section className="categories section" id="awards">
      <div className="categories__inner">
        <h2 className="categories__title">
          <span className="categories__dividers" aria-hidden="true">&laquo;&raquo;</span>
          Explore Categories <small>(Monthly Awards)</small>
          <span className="categories__dividers" aria-hidden="true">&laquo;&raquo;</span>
        </h2>

        <div className="categories__grid">
          {categories.map((c) => {
            const Icon = ICONS[c.name.toLowerCase()] ?? Award;
            return (
              <Link to={`/vote?category=${c.slug}`} className="categories__card" key={c.id}>
                <Icon size={28} />
                <span className="categories__label">{c.name}</span>
                <span className="categories__prize">{c.prizeAmount ? formatRwf(c.prizeAmount) : 'Recognition'}</span>
              </Link>
            );
          })}
        </div>

        <Link to="/categories" className="btn btn--outline categories__view-all">
          View All Categories
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
