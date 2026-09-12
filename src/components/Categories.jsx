import {
  Music2, PlaySquare, Music, Smile, PenLine, Star,
  CircleDot, PersonStanding, Headphones, Video, ArrowRight,
} from 'lucide-react';
import './Categories.scss';

const CATEGORIES = [
  { icon: Music2, label: 'Best TikToker' },
  { icon: PlaySquare, label: 'Best YouTuber' },
  { icon: Music, label: 'Best Musician' },
  { icon: Smile, label: 'Best Comedian' },
  { icon: PenLine, label: 'Best Journalist' },
  { icon: Star, label: 'Best Influencer' },
  { icon: CircleDot, label: 'Best Footballer' },
  { icon: PersonStanding, label: 'Best Dancer' },
  { icon: Headphones, label: 'Best DJ' },
  { icon: Video, label: 'Best Actor' },
];

const PRIZE = '3 million RWF';

export default function Categories() {
  return (
    <section className="categories section" id="awards">
      <div className="categories__inner">
        <h2 className="categories__title">
          <span className="categories__dividers" aria-hidden="true">&laquo;&raquo;</span>
          Explore Categories <small>(Monthly Awards)</small>
          <span className="categories__dividers" aria-hidden="true">&laquo;&raquo;</span>
        </h2>

        <div className="categories__grid">
          {CATEGORIES.map(({ icon: Icon, label }) => (
            <button type="button" className="categories__card" key={label}>
              <Icon size={28} />
              <span className="categories__label">{label}</span>
              <span className="categories__prize">{PRIZE}</span>
            </button>
          ))}
        </div>

        <button type="button" className="btn btn--outline categories__view-all">
          View All Categories
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
}
