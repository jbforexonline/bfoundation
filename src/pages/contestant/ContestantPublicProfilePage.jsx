import { useState } from 'react';
import { User, Award, Link2, FileText, Instagram, Vote, Trophy, TrendingUp } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import '../../components/dashboard/DashboardPage.scss';
import '../../components/auth/AuthForm.scss';
import './ContestantPublicProfilePage.scss';

const CATEGORIES = [
  'Best TikToker', 'Best YouTuber', 'Best Musician', 'Best Comedian', 'Best Journalist',
  'Best Influencer', 'Best Footballer', 'Best Dancer', 'Best DJ', 'Best Actor', 'Entrepreneur',
];

export default function ContestantPublicProfilePage() {
  const [form, setForm] = useState({
    fullName: 'Malaika Uwase',
    category: 'Best Musician',
    bio: 'Singer-songwriter from Kigali blending traditional Rwandan melodies with modern Afrobeat production.',
    instagram: '@malaika.uwase',
    portfolio: 'https://malaikauwase.com',
  });
  const [saved, setSaved] = useState(false);

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire up to your real "update contestant profile" endpoint.
    console.log('Contestant profile saved', form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Public Profile</h1>
          <p className="dash-page__subtitle">This is what fans see on your public contestant profile.</p>
        </div>
      </div>

      <div className="dash-page__stats">
        <StatCard icon={Vote} label="Current Votes" value="18,420" />
        <StatCard icon={Trophy} label="Category Rank" value="#1" sub="Best Musician" />
        <StatCard icon={TrendingUp} label="7-Day Growth" value="+12%" />
      </div>

      <div>
        <h2 className="dash-page__section-title">Profile details</h2>

        {saved && (
          <p className="auth-form__success" role="status">
            Your profile has been updated.
          </p>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate style={{ maxWidth: 520 }}>
          <div className="auth-form__row">
            <div className="auth-form__field">
              <label htmlFor="c-name">Full name</label>
              <div className="auth-form__input-wrap">
                <User size={16} />
                <input id="c-name" type="text" value={form.fullName} onChange={update('fullName')} />
              </div>
            </div>

            <div className="auth-form__field">
              <label htmlFor="c-category">Category</label>
              <div className="auth-form__input-wrap auth-form__input-wrap--select">
                <Award size={16} />
                <select id="c-category" value={form.category} onChange={update('category')}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="auth-form__field">
            <label htmlFor="c-bio">Bio</label>
            <div className="auth-form__input-wrap contestant-profile__textarea-wrap">
              <FileText size={16} />
              <textarea id="c-bio" rows={4} value={form.bio} onChange={update('bio')} />
            </div>
          </div>

          <div className="auth-form__row">
            <div className="auth-form__field">
              <label htmlFor="c-instagram">Instagram handle</label>
              <div className="auth-form__input-wrap">
                <Instagram size={16} />
                <input id="c-instagram" type="text" value={form.instagram} onChange={update('instagram')} />
              </div>
            </div>

            <div className="auth-form__field">
              <label htmlFor="c-portfolio">Portfolio / website</label>
              <div className="auth-form__input-wrap">
                <Link2 size={16} />
                <input id="c-portfolio" type="url" value={form.portfolio} onChange={update('portfolio')} />
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn--gold" style={{ alignSelf: 'flex-start', padding: '10px 24px' }}>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
