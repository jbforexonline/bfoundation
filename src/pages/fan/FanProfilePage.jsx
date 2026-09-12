import { useState } from 'react';
import { User, Mail, Phone, Globe, Vote, Heart, Wallet } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import '../../components/dashboard/DashboardPage.scss';
import '../../components/auth/AuthForm.scss';

const COUNTRIES = ['Rwanda', 'Burundi', 'Uganda', 'Kenya', 'Tanzania'];

export default function FanProfilePage() {
  const [form, setForm] = useState({
    fullName: 'Joyce Uwase',
    email: 'joyce@example.com',
    phone: '+250 788 123 456',
    country: 'Rwanda',
  });
  const [saved, setSaved] = useState(false);

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire up to your real "update profile" endpoint.
    console.log('Profile saved', form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">My Profile</h1>
          <p className="dash-page__subtitle">Manage your account details and preferences.</p>
        </div>
      </div>

      <div className="dash-page__stats">
        <StatCard icon={Vote} label="Votes Cast" value="27" sub="Across 6 categories" />
        <StatCard icon={Heart} label="Favorites" value="4" sub="Contestants followed" />
        <StatCard icon={Wallet} label="Votes Balance" value="35" sub="Unused purchased votes" />
      </div>

      <div>
        <h2 className="dash-page__section-title">Account details</h2>

        {saved && (
          <p className="auth-form__success" role="status">
            Your profile has been updated.
          </p>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate style={{ maxWidth: 480 }}>
          <div className="auth-form__field">
            <label htmlFor="fan-name">Full name</label>
            <div className="auth-form__input-wrap">
              <User size={16} />
              <input id="fan-name" type="text" value={form.fullName} onChange={update('fullName')} />
            </div>
          </div>

          <div className="auth-form__field">
            <label htmlFor="fan-email">Email address</label>
            <div className="auth-form__input-wrap">
              <Mail size={16} />
              <input id="fan-email" type="email" value={form.email} onChange={update('email')} />
            </div>
          </div>

          <div className="auth-form__row">
            <div className="auth-form__field">
              <label htmlFor="fan-phone">Phone number</label>
              <div className="auth-form__input-wrap">
                <Phone size={16} />
                <input id="fan-phone" type="tel" value={form.phone} onChange={update('phone')} />
              </div>
            </div>

            <div className="auth-form__field">
              <label htmlFor="fan-country">Country</label>
              <div className="auth-form__input-wrap auth-form__input-wrap--select">
                <Globe size={16} />
                <select id="fan-country" value={form.country} onChange={update('country')}>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
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
