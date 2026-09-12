import { useState } from 'react';
import { User, Mail, Award, FileText } from 'lucide-react';
import PageHero from '../components/PageHero';
import '../components/auth/AuthForm.scss';
import './NominatePage.scss';

const CATEGORIES = [
  'Best TikToker', 'Best YouTuber', 'Best Musician', 'Best Comedian', 'Best Journalist',
  'Best Influencer', 'Best Footballer', 'Best Dancer', 'Best DJ', 'Best Actor', 'Entrepreneur',
];

const INITIAL_FORM = {
  nomineeName: '',
  category: CATEGORIES[0],
  yourName: '',
  yourEmail: '',
  reason: '',
};

export default function NominatePage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const update = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validate = () => {
    const next = {};
    if (!form.nomineeName.trim()) next.nomineeName = 'Nominee name is required.';
    if (!form.yourName.trim()) next.yourName = 'Your name is required.';
    if (!form.yourEmail.trim()) next.yourEmail = 'Your email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(form.yourEmail)) next.yourEmail = 'Enter a valid email address.';
    if (!form.reason.trim() || form.reason.trim().length < 20) {
      next.reason = 'Tell us a bit more — at least 20 characters.';
    }
    return next;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length === 0) {
      // TODO: wire up to your real nomination endpoint.
      console.log('Nomination submitted', form);
      setSubmitted(true);
      setForm(INITIAL_FORM);
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Nominate"
        title="Recognize a talent"
        description="Know someone doing exceptional work in music, sport, business, media, or their community? Put them forward for this year's awards."
      />

      <section className="nominate-page section">
        <div className="nominate-page__inner">
          <div className="nominate-page__form-card">
            {submitted && (
              <p className="auth-form__success" role="status">
                Thanks — your nomination has been submitted for review.
              </p>
            )}

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              <div className="auth-form__field">
                <label htmlFor="nominee-name">Nominee&rsquo;s full name</label>
                <div className="auth-form__input-wrap">
                  <User size={16} />
                  <input
                    id="nominee-name"
                    type="text"
                    placeholder="Who are you nominating?"
                    value={form.nomineeName}
                    onChange={update('nomineeName')}
                  />
                </div>
                {errors.nomineeName && <span className="auth-form__error">{errors.nomineeName}</span>}
              </div>

              <div className="auth-form__field">
                <label htmlFor="nominee-category">Award category</label>
                <div className="auth-form__input-wrap auth-form__input-wrap--select">
                  <Award size={16} />
                  <select id="nominee-category" value={form.category} onChange={update('category')}>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="auth-form__row">
                <div className="auth-form__field">
                  <label htmlFor="your-name">Your name</label>
                  <div className="auth-form__input-wrap">
                    <User size={16} />
                    <input
                      id="your-name"
                      type="text"
                      placeholder="Full name"
                      value={form.yourName}
                      onChange={update('yourName')}
                    />
                  </div>
                  {errors.yourName && <span className="auth-form__error">{errors.yourName}</span>}
                </div>

                <div className="auth-form__field">
                  <label htmlFor="your-email">Your email</label>
                  <div className="auth-form__input-wrap">
                    <Mail size={16} />
                    <input
                      id="your-email"
                      type="email"
                      placeholder="you@example.com"
                      value={form.yourEmail}
                      onChange={update('yourEmail')}
                    />
                  </div>
                  {errors.yourEmail && <span className="auth-form__error">{errors.yourEmail}</span>}
                </div>
              </div>

              <div className="auth-form__field">
                <label htmlFor="reason">Why do they deserve this recognition?</label>
                <div className="auth-form__input-wrap nominate-page__textarea-wrap">
                  <FileText size={16} />
                  <textarea
                    id="reason"
                    rows={5}
                    placeholder="Tell us about their impact, achievements, or story..."
                    value={form.reason}
                    onChange={update('reason')}
                  />
                </div>
                {errors.reason && <span className="auth-form__error">{errors.reason}</span>}
              </div>

              <button type="submit" className="btn btn--gold auth-form__submit">
                Submit Nomination
              </button>
            </form>
          </div>

          <aside className="nominate-page__aside">
            <h3>How nominations work</h3>
            <ol>
              <li>Submit a nominee with a short reason for their recognition.</li>
              <li>Our team reviews every submission against the category guidelines.</li>
              <li>Approved nominees are added to the public voting ballot.</li>
              <li>Fans vote, and winners are celebrated at the awards.</li>
            </ol>
          </aside>
        </div>
      </section>
    </>
  );
}
