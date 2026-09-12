import { useState } from 'react';
import { User, Mail, MessageSquare, MapPin, Phone, Clock } from 'lucide-react';
import PageHero from '../components/PageHero';
import '../components/auth/AuthForm.scss';
import './ContactPage.scss';

const INITIAL_FORM = { name: '', email: '', subject: '', message: '' };

const INFO = [
  { icon: MapPin, label: 'KG 7 Ave, Kigali, Rwanda' },
  { icon: Phone, label: '+250 788 000 000' },
  { icon: Mail, label: 'hello@bfoundation.rw' },
  { icon: Clock, label: 'Mon–Fri, 9:00–17:00 CAT' },
];

export default function ContactPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const update = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Your name is required.';
    if (!form.email.trim()) next.email = 'Your email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (!form.subject.trim()) next.subject = 'Please add a subject.';
    if (!form.message.trim() || form.message.trim().length < 10) {
      next.message = 'Message should be at least 10 characters.';
    }
    return next;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length === 0) {
      // TODO: wire up to your real contact/support endpoint.
      console.log('Contact message', form);
      setSubmitted(true);
      setForm(INITIAL_FORM);
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Contact Us"
        title="We'd love to hear from you"
        description="Questions about nominations, voting, or partnerships? Send us a message and our team will get back to you."
      />

      <section className="contact-page section">
        <div className="contact-page__inner">
          <div className="contact-page__form-card">
            {submitted && (
              <p className="auth-form__success" role="status">
                Message sent — we&rsquo;ll reply within 2 business days.
              </p>
            )}

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              <div className="auth-form__row">
                <div className="auth-form__field">
                  <label htmlFor="contact-name">Your name</label>
                  <div className="auth-form__input-wrap">
                    <User size={16} />
                    <input
                      id="contact-name"
                      type="text"
                      placeholder="Full name"
                      value={form.name}
                      onChange={update('name')}
                    />
                  </div>
                  {errors.name && <span className="auth-form__error">{errors.name}</span>}
                </div>

                <div className="auth-form__field">
                  <label htmlFor="contact-email">Your email</label>
                  <div className="auth-form__input-wrap">
                    <Mail size={16} />
                    <input
                      id="contact-email"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={update('email')}
                    />
                  </div>
                  {errors.email && <span className="auth-form__error">{errors.email}</span>}
                </div>
              </div>

              <div className="auth-form__field">
                <label htmlFor="contact-subject">Subject</label>
                <div className="auth-form__input-wrap">
                  <MessageSquare size={16} />
                  <input
                    id="contact-subject"
                    type="text"
                    placeholder="What is this about?"
                    value={form.subject}
                    onChange={update('subject')}
                  />
                </div>
                {errors.subject && <span className="auth-form__error">{errors.subject}</span>}
              </div>

              <div className="auth-form__field">
                <label htmlFor="contact-message">Message</label>
                <div className="auth-form__input-wrap contact-page__textarea-wrap">
                  <MessageSquare size={16} />
                  <textarea
                    id="contact-message"
                    rows={5}
                    placeholder="Tell us more..."
                    value={form.message}
                    onChange={update('message')}
                  />
                </div>
                {errors.message && <span className="auth-form__error">{errors.message}</span>}
              </div>

              <button type="submit" className="btn btn--gold auth-form__submit">
                Send Message
              </button>
            </form>
          </div>

          <aside className="contact-page__aside">
            <h3>Get in touch</h3>
            <ul>
              {INFO.map(({ icon: Icon, label }) => (
                <li key={label}>
                  <Icon size={16} />
                  {label}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>
    </>
  );
}
