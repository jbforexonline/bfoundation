import { useState } from 'react';
import { User, Mail, Phone, Award, Link2, FileText } from 'lucide-react';
import PageHero from '../components/PageHero';
import '../components/auth/AuthForm.scss';
import './ApplicationPage.scss';

const CATEGORIES = [
  'Best TikToker', 'Best YouTuber', 'Best Musician', 'Best Comedian', 'Best Journalist',
  'Best Influencer', 'Best Footballer', 'Best Dancer', 'Best DJ', 'Best Actor', 'Entrepreneur',
];

const INITIAL_FORM = {
  fullName: '',
  email: '',
  phone: '',
  category: CATEGORIES[0],
  portfolio: '',
  pitch: '',
};

export default function ApplicationPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = 'Full name is required.';
    if (!form.email.trim()) next.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (!form.phone.trim()) next.phone = 'Phone number is required.';
    if (!form.pitch.trim() || form.pitch.trim().length < 30) {
      next.pitch = 'Tell us more about yourself — at least 30 characters.';
    }
    return next;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length === 0) {
      // TODO: wire up to your real contestant-application endpoint.
      console.log('Application submitted', form);
      setSubmitted(true);
      setForm(INITIAL_FORM);
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Apply"
        title="Enter as a contestant"
        description="Ready to compete for recognition, prize money, and a place in the Hall of Fame? Apply to a category below."
      />

      <section className="application-page section">
        <div className="application-page__inner">
          <div className="application-page__form-card">
            {submitted && (
              <p className="auth-form__success" role="status">
                Application received — our team will review it and follow up by email.
              </p>
            )}

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              <div className="auth-form__row">
                <div className="auth-form__field">
                  <label htmlFor="app-name">Full name</label>
                  <div className="auth-form__input-wrap">
                    <User size={16} />
                    <input id="app-name" type="text" placeholder="Your full name" value={form.fullName} onChange={update('fullName')} />
                  </div>
                  {errors.fullName && <span className="auth-form__error">{errors.fullName}</span>}
                </div>

                <div className="auth-form__field">
                  <label htmlFor="app-category">Category</label>
                  <div className="auth-form__input-wrap auth-form__input-wrap--select">
                    <Award size={16} />
                    <select id="app-category" value={form.category} onChange={update('category')}>
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="auth-form__row">
                <div className="auth-form__field">
                  <label htmlFor="app-email">Email address</label>
                  <div className="auth-form__input-wrap">
                    <Mail size={16} />
                    <input id="app-email" type="email" placeholder="you@example.com" value={form.email} onChange={update('email')} />
                  </div>
                  {errors.email && <span className="auth-form__error">{errors.email}</span>}
                </div>

                <div className="auth-form__field">
                  <label htmlFor="app-phone">Phone number</label>
                  <div className="auth-form__input-wrap">
                    <Phone size={16} />
                    <input id="app-phone" type="tel" placeholder="+250 7xx xxx xxx" value={form.phone} onChange={update('phone')} />
                  </div>
                  {errors.phone && <span className="auth-form__error">{errors.phone}</span>}
                </div>
              </div>

              <div className="auth-form__field">
                <label htmlFor="app-portfolio">Portfolio / social link (optional)</label>
                <div className="auth-form__input-wrap">
                  <Link2 size={16} />
                  <input id="app-portfolio" type="url" placeholder="https://" value={form.portfolio} onChange={update('portfolio')} />
                </div>
              </div>

              <div className="auth-form__field">
                <label htmlFor="app-pitch">Why should you be selected?</label>
                <div className="auth-form__input-wrap application-page__textarea-wrap">
                  <FileText size={16} />
                  <textarea
                    id="app-pitch"
                    rows={5}
                    placeholder="Tell us about your work, your audience, and why you deserve a spot on the ballot..."
                    value={form.pitch}
                    onChange={update('pitch')}
                  />
                </div>
                {errors.pitch && <span className="auth-form__error">{errors.pitch}</span>}
              </div>

              <button type="submit" className="btn btn--gold auth-form__submit" style={{ width: 'auto', padding: '12px 28px' }}>
                Submit Application
              </button>
            </form>
          </div>

          <aside className="application-page__aside">
            <h3>What happens next</h3>
            <ol>
              <li>Our team reviews your application against the category criteria.</li>
              <li>Approved applicants are added to the public ballot for their category.</li>
              <li>Fans vote, and you can track your standing from your dashboard.</li>
              <li>Category winners are celebrated at the Awards Night.</li>
            </ol>
          </aside>
        </div>
      </section>
    </>
  );
}
