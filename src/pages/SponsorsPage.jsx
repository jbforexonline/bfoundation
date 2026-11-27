import { useState } from 'react';
import { Handshake, Building2, User, Mail, Phone, Globe, Award, MessageSquare } from 'lucide-react';
import PageHero from '../components/PageHero';
import Modal from '../components/ui/Modal';
import Field from '../components/ui/Field';
import Notice from '../components/ui/Notice';
import useApi from '../hooks/useApi';
import { api, initialsOf } from '../api/client';
import '../components/auth/AuthForm.scss';
import './SponsorsPage.scss';

const TONE = { PLATINUM: 'platinum', GOLD: 'gold', SILVER: 'silver' };
const EMPTY = { companyName: '', contactName: '', contactEmail: '', contactPhone: '', website: '', packageType: 'GOLD', message: '' };

export default function SponsorsPage() {
  const { data, error, loading } = useApi('/sponsors');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [done, setDone] = useState('');
  const [sending, setSending] = useState(false);
  const tiers = data?.tiers ?? [];

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    setErrors({});
    setFormError('');
    try {
      const d = await api('/sponsors/requests', { method: 'POST', body: form, auth: false });
      setDone(d._message);
      setForm(EMPTY);
    } catch (err) {
      setErrors(err.fieldErrors);
      setFormError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Sponsors"
        title="Partners powering the platform"
        description="BFOUNDATION is made possible by organizations investing directly in Rwandan talent and community impact."
      />

      <section className="sponsors-page section">
        <div className="sponsors-page__inner">
          {error && <p style={{ color: '#d13b3b', textAlign: 'center' }}>{error.message}</p>}
          {loading && !data && <p style={{ color: '#a8a49b', textAlign: 'center' }}>Loading partners…</p>}
          {tiers.map((tier) => (
            <div className="sponsors-page__tier" key={tier.tier}>
              <h2 className={`sponsors-page__tier-title sponsors-page__tier-title--${TONE[tier.tier]}`}>{tier.name}</h2>
              <div className="sponsors-page__grid">
                {tier.sponsors.map((s) => {
                  const card = (
                    <>
                      <div className={`sponsors-page__logo sponsors-page__logo--${TONE[tier.tier]}`} style={s.logo ? { background: '#fff', padding: 6 } : undefined}>
                        {s.logo ? <img src={s.logo} alt={`${s.companyName} logo`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : initialsOf(s.companyName)}
                      </div>
                      <p>{s.companyName}</p>
                    </>
                  );
                  return s.website ? (
                    <a className="sponsors-page__card" key={s.id} href={s.website} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                      {card}
                    </a>
                  ) : (
                    <div className="sponsors-page__card" key={s.id}>
                      {card}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="sponsors-page__cta">
            <Handshake size={26} />
            <div>
              <h3>Become a sponsor</h3>
              <p>Partner with BFOUNDATION to reach an engaged, growing community of fans and creators.</p>
            </div>
            <button type="button" className="btn btn--gold" onClick={() => { setOpen(true); setDone(''); setFormError(''); }}>
              Get in Touch
            </button>
          </div>
        </div>
      </section>

      <Modal isOpen={open} title="Become a sponsor" onClose={() => setOpen(false)}>
        {done ? (
          <div style={{ display: 'grid', gap: 12 }}>
            <Notice tone="success">{done}</Notice>
            <button type="button" className="btn btn--gold" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>
        ) : (
          <form className="auth-form" onSubmit={submit} noValidate>
            <Notice tone="error">{formError}</Notice>
            <Field id="sr-company" label="Company / organization" icon={Building2} error={errors.companyName}>
              <input id="sr-company" type="text" value={form.companyName} onChange={update('companyName')} />
            </Field>
            <div className="auth-form__row">
              <Field id="sr-name" label="Your name" icon={User} error={errors.contactName}>
                <input id="sr-name" type="text" value={form.contactName} onChange={update('contactName')} />
              </Field>
              <Field id="sr-email" label="Email" icon={Mail} error={errors.contactEmail}>
                <input id="sr-email" type="email" value={form.contactEmail} onChange={update('contactEmail')} />
              </Field>
            </div>
            <div className="auth-form__row">
              <Field id="sr-phone" label="Phone (optional)" icon={Phone} error={errors.contactPhone}>
                <input id="sr-phone" type="tel" value={form.contactPhone} onChange={update('contactPhone')} />
              </Field>
              <Field id="sr-web" label="Website (optional)" icon={Globe} error={errors.website}>
                <input id="sr-web" type="text" placeholder="company.rw" value={form.website} onChange={update('website')} />
              </Field>
            </div>
            <Field id="sr-tier" label="Partnership level you’re interested in" icon={Award} error={errors.packageType} select>
              <select id="sr-tier" value={form.packageType} onChange={update('packageType')}>
                <option value="PLATINUM">Platinum</option>
                <option value="GOLD">Gold</option>
                <option value="SILVER">Silver</option>
              </select>
            </Field>
            <Field id="sr-msg" label="Message (optional)" icon={MessageSquare} error={errors.message}>
              <textarea
                id="sr-msg"
                rows={3}
                value={form.message}
                onChange={update('message')}
                style={{ width: '100%', background: 'transparent', border: 'none', color: 'inherit', font: 'inherit', resize: 'vertical', outline: 'none' }}
              />
            </Field>
            <button type="submit" className="btn btn--gold auth-form__submit" disabled={sending}>
              {sending ? 'Sending…' : 'Send request'}
            </button>
          </form>
        )}
      </Modal>
    </>
  );
}
