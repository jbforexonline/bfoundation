import { useEffect, useState } from 'react';
import { User, Mail, Phone, Globe, Vote, Ticket, Megaphone, Lock, Calendar, MapPin, Users, Gift, Copy, Check } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import Field from '../../components/ui/Field';
import Notice from '../../components/ui/Notice';
import useApi from '../../hooks/useApi';
import { api, session } from '../../api/client';
import { useAuth } from '../../auth/AuthContext';
import '../../components/dashboard/DashboardPage.scss';
import '../../components/auth/AuthForm.scss';

const COUNTRIES = ['Rwanda', 'Burundi', 'Uganda', 'Kenya', 'Tanzania'];
const PROVINCES = ['Kigali', 'Northern', 'Southern', 'Eastern', 'Western', 'Outside Rwanda'];
const GENDERS = [
  ['', 'Prefer not to say'],
  ['FEMALE', 'Female'],
  ['MALE', 'Male'],
  ['OTHER', 'Other'],
];

// "Invite friends": the fan's referral link and the bonus votes it earned.
function InviteFriends() {
  const { data, error } = useApi('/referrals/me');
  const [copied, setCopied] = useState(false);
  if (error) return <Notice tone="error">{error.message}</Notice>;
  if (!data) return null;
  const copy = () => {
    navigator.clipboard?.writeText(data.link).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div style={{ marginTop: 32 }}>
      <h2 className="dash-page__section-title">Invite friends</h2>
      <p style={{ color: '#a8a49b', fontSize: '0.85rem', marginBottom: 12, maxWidth: 560 }}>
        Share your link. When a friend signs up and verifies their email
        {data.rewardVotes > 0 ? `, you get ${data.rewardVotes} bonus votes to use on the Vote page` : ''}.
      </p>
      <div style={{ display: 'flex', gap: 8, maxWidth: 560, flexWrap: 'wrap' }}>
        <input
          readOnly
          value={data.link}
          onFocus={(e) => e.target.select()}
          style={{ flex: 1, minWidth: 220, background: '#16130d', border: '1px solid #2e2a22', borderRadius: 8, color: '#e9e6df', padding: '10px 12px' }}
        />
        <button type="button" className="btn btn--gold" onClick={copy}>
          {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? 'Copied' : 'Copy link'}
        </button>
      </div>
      <div className="dash-page__stats" style={{ marginTop: 16 }}>
        <StatCard icon={Users} label="Friends invited" value={data.invited} sub={`${data.joined} verified`} />
        <StatCard icon={Gift} label="Bonus votes earned" value={data.votesEarned} />
        <StatCard icon={Vote} label="Bonus votes left" value={data.voteBalance} sub="Use them on the Vote page" />
      </div>
    </div>
  );
}

export default function FanProfilePage() {
  const { user, setCurrentUser } = useAuth();
  const history = useApi('/votes/history', { limit: 1 });
  const tickets = useApi('/tickets', { limit: 1 });
  const supports = useApi('/nominations/support-history', { limit: 1 });

  const [form, setForm] = useState({ fullName: '', email: '', phone: '', country: 'Rwanda', gender: '', birthYear: '', province: '' });
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState(null);
  const [saving, setSaving] = useState(false);
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwErrors, setPwErrors] = useState({});
  const [pwNotice, setPwNotice] = useState(null);

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.name ?? '',
        email: user.email ?? '',
        phone: user.phone ?? '',
        country: user.country ?? 'Rwanda',
        gender: user.gender ?? '',
        birthYear: user.birthYear ?? '',
        province: user.province ?? '',
      });
    }
  }, [user]);

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setNotice(null);
    try {
      const data = await api('/users/me', {
        method: 'PATCH',
        body: { ...form, phone: form.phone || undefined, gender: form.gender || null, province: form.province || null, birthYear: form.birthYear || null },
      });
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
          <p style={{ color: '#a8a49b', fontSize: '0.8rem', margin: '4px 0 0' }}>
            Optional — only used anonymously (as percentages) to show contestants who supports them.
          </p>
          <div className="auth-form__row">
            <Field id="fan-gender" label="Gender" icon={User} error={errors.gender} select>
              <select id="fan-gender" value={form.gender} onChange={update('gender')}>
                {GENDERS.map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </Field>
            <Field id="fan-birth" label="Year of birth" icon={Calendar} error={errors.birthYear}>
              <input id="fan-birth" type="number" inputMode="numeric" placeholder="e.g. 2001" value={form.birthYear} onChange={update('birthYear')} />
            </Field>
          </div>
          <Field id="fan-province" label="Where you live" icon={MapPin} error={errors.province} select>
            <select id="fan-province" value={form.province} onChange={update('province')}>
              <option value="">Prefer not to say</option>
              {PROVINCES.map((p) => (
                <option key={p} value={p}>
                  {p === 'Outside Rwanda' ? p : `${p}${p === 'Kigali' ? ' City' : ' Province'}`}
                </option>
              ))}
            </select>
          </Field>
          <button type="submit" className="btn btn--gold" style={{ alignSelf: 'flex-start', padding: '10px 24px' }} disabled={saving}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </div>

      <InviteFriends />

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
