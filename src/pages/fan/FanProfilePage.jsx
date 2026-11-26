import { useEffect, useState } from 'react';
import { User, Mail, Phone, Globe, Vote, Ticket, Megaphone, Lock } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import Field from '../../components/ui/Field';
import Notice from '../../components/ui/Notice';
import useApi from '../../hooks/useApi';
import { api, session } from '../../api/client';
import { useAuth } from '../../auth/AuthContext';
import '../../components/dashboard/DashboardPage.scss';
import '../../components/auth/AuthForm.scss';

const COUNTRIES = ['Rwanda', 'Burundi', 'Uganda', 'Kenya', 'Tanzania'];

export default function FanProfilePage() {
  const { user, setCurrentUser } = useAuth();
  const history = useApi('/votes/history', { limit: 1 });
  const tickets = useApi('/tickets', { limit: 1 });
  const supports = useApi('/nominations/support-history', { limit: 1 });

  const [form, setForm] = useState({ fullName: '', email: '', phone: '', country: 'Rwanda' });
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState(null);
  const [saving, setSaving] = useState(false);
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwErrors, setPwErrors] = useState({});
  const [pwNotice, setPwNotice] = useState(null);

  useEffect(() => {
    if (user) setForm({ fullName: user.name ?? '', email: user.email ?? '', phone: user.phone ?? '', country: user.country ?? 'Rwanda' });
  }, [user]);

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setNotice(null);
    try {
      const data = await api('/users/me', { method: 'PATCH', body: { ...form, phone: form.phone || undefined } });
      setCurrentUser(data.user);
      setNotice({ tone: 'success', text: data._message });
    } catch (err) {
      setErrors(err.fieldErrors);
      setNotice({ tone: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const resendVerification = async () => {
    try {
      await api('/auth/resend-verification', { method: 'POST', body: { email: user.email }, auth: false });
      setNotice({ tone: 'success', text: `We sent a new verification link to ${user.email}.` });
    } catch (err) {
      setNotice({ tone: 'error', text: err.message });
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setPwErrors({});
    setPwNotice(null);
    try {
      const data = await api('/auth/change-password', { method: 'POST', body: pw });
      // Other devices are logged out; this one gets fresh tokens.
      session.update({ accessToken: data.accessToken, refreshToken: data.refreshToken });
      setPw({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPwNotice({ tone: 'success', text: 'Password changed. You were logged out on your other devices.' });
    } catch (err) {
      setPwErrors(err.fieldErrors);
      setPwNotice({ tone: 'error', text: err.message });
    }
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
        <StatCard icon={Vote} label="Votes Cast" value={history.data?.summary.totalVotesCast ?? '—'} sub={history.data ? `Across ${history.data.summary.categoriesVotedIn} categories` : undefined} />
        <StatCard icon={Megaphone} label="Nominations Supported" value={supports.data?.summary.totalSupports ?? '—'} />
        <StatCard icon={Ticket} label="Event Tickets" value={tickets.data?.pagination.total ?? '—'} />
      </div>

      {user && !user.emailVerified && (
        <Notice tone="info">
          Your email address is not verified yet, so you can’t vote. Check your inbox, or{' '}
          <button type="button" onClick={resendVerification} style={{ background: 'none', border: 0, color: 'inherit', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}>
            send a new link
          </button>
          .
        </Notice>
      )}

      <div>
        <h2 className="dash-page__section-title">Account details</h2>
        <Notice tone={notice?.tone}>{notice?.text}</Notice>

        <form className="auth-form" onSubmit={handleSubmit} noValidate style={{ maxWidth: 480 }}>
          <Field id="fan-name" label="Full name" icon={User} error={errors.fullName}>
            <input id="fan-name" type="text" value={form.fullName} onChange={update('fullName')} />
          </Field>
          <Field id="fan-email" label="Email address" icon={Mail} error={errors.email}>
            <input id="fan-email" type="email" value={form.email} onChange={update('email')} />
          </Field>
          <div className="auth-form__row">
            <Field id="fan-phone" label="Phone number" icon={Phone} error={errors.phone}>
              <input id="fan-phone" type="tel" value={form.phone} onChange={update('phone')} />
            </Field>
            <Field id="fan-country" label="Country" icon={Globe} error={errors.country} select>
              <select id="fan-country" value={form.country} onChange={update('country')}>
                {[...new Set([form.country, ...COUNTRIES])].filter(Boolean).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <button type="submit" className="btn btn--gold" style={{ alignSelf: 'flex-start', padding: '10px 24px' }} disabled={saving}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </div>

      {user?.hasPassword && (
        <div style={{ marginTop: 32 }}>
          <h2 className="dash-page__section-title">Change password</h2>
          <Notice tone={pwNotice?.tone}>{pwNotice?.text}</Notice>
          <form className="auth-form" onSubmit={changePassword} noValidate style={{ maxWidth: 480 }}>
            <Field id="pw-current" label="Current password" icon={Lock} error={pwErrors.currentPassword}>
              <input id="pw-current" type="password" autoComplete="current-password" value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} />
            </Field>
            <div className="auth-form__row">
              <Field id="pw-new" label="New password" icon={Lock} error={pwErrors.newPassword}>
                <input id="pw-new" type="password" autoComplete="new-password" value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} />
              </Field>
              <Field id="pw-confirm" label="Confirm" icon={Lock} error={pwErrors.confirmPassword}>
                <input id="pw-confirm" type="password" autoComplete="new-password" value={pw.confirmPassword} onChange={(e) => setPw({ ...pw, confirmPassword: e.target.value })} />
              </Field>
            </div>
            <button type="submit" className="btn btn--outline" style={{ alignSelf: 'flex-start', padding: '10px 24px' }}>
              Change Password
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
