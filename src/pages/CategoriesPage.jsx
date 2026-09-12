import {
  Music2, PlaySquare, Music, Smile, PenLine, Star,
  CircleDot, PersonStanding, Headphones, Video, Briefcase,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import './CategoriesPage.scss';

const CATEGORIES = [
  { icon: Music2, label: 'Best TikToker', desc: 'Short-form creators building culture, one video at a time.', contestants: 142 },
  { icon: PlaySquare, label: 'Best YouTuber', desc: 'Long-form storytellers, vloggers, and educators.', contestants: 98 },
  { icon: Music, label: 'Best Musician', desc: 'Artists shaping the sound of Rwanda and the region.', contestants: 176 },
  { icon: Smile, label: 'Best Comedian', desc: 'Voices making the whole country laugh.', contestants: 64 },
  { icon: PenLine, label: 'Best Journalist', desc: 'Reporters and columnists holding the line on truth.', contestants: 51 },
  { icon: Star, label: 'Best Influencer', desc: 'Creators with real, engaged communities.', contestants: 130 },
  { icon: CircleDot, label: 'Best Footballer', desc: 'On-pitch talent making the nation proud.', contestants: 88 },
  { icon: PersonStanding, label: 'Best Dancer', desc: 'Movement, choreography, and stage presence.', contestants: 47 },
  { icon: Headphones, label: 'Best DJ', desc: 'The people behind every unforgettable set.', contestants: 39 },
  { icon: Video, label: 'Best Actor', desc: 'Screen and stage performers who move audiences.', contestants: 42 },
  { icon: Briefcase, label: 'Entrepreneur', desc: 'Founders building businesses that build Rwanda.', contestants: 73 },
];

export default function CategoriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Categories"
        title="24+ ways to recognize excellence"
        description="Every category runs its own monthly competition, with its own prize pool and its own set of nominated contestants."
      />

      <section className="categories-page section">
        <div className="categories-page__inner">
          <div className="categories-page__grid">
            {CATEGORIES.map(({ icon: Icon, label, desc, contestants }) => (
              <div className="categories-page__card" key={label}>
                <div className="categories-page__icon">
                  <Icon size={24} />
                </div>
                <h3>{label}</h3>
                <p>{desc}</p>
                <div className="categories-page__meta">
                  <span>{contestants} contestants</span>
                  <span className="categories-page__prize">3 million RWF</span>
                </div>
                <Link to="/contestants" className="btn btn--outline categories-page__cta">
                  View Contestants
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
