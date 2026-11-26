import { useEffect, useState } from 'react';
import { User, Award, Link2, FileText, Instagram, Trophy, BadgeCheck, ShieldCheck, Video, Lock } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import Field from '../../components/ui/Field';
import Notice from '../../components/ui/Notice';
import useApi from '../../hooks/useApi';
import { api, session, titleCase } from '../../api/client';
import { useAuth } from '../../auth/AuthContext';
import '../../components/dashboard/DashboardPage.scss';
import '../../components/auth/AuthForm.scss';
import './ContestantPublicProfilePage.scss';

export default function ContestantPublicProfilePage() {
  const { refreshUser } = useAuth();
  const { data, error, reload } = useApi('/contestants/me');
  const me = data?.contestant;
  const [form, setForm] = useState({ fullName: '', bio: '', instagram: '', portfolioUrl: '', videoUrl: '' });
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState(null);
  const [saving, setSaving] = useState(false);
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwErrors, setPwErrors] = useState({});
  const [pwNotice, setPwNotice] = useState(null);

  useEffect(() => {
    if (me) {
      setForm({
        fullName: me.name ?? '',
        bio: me.bio ?? '',
        instagram: me.instagram ?? '',
        portfolioUrl: me.portfolioUrl ?? '',
        videoUrl: me.videoUrl ?? '',
      });
    }
  }, [me]);

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setNotice(null);
    try {
      await api('/contestants/me', { method: 'PATCH', body: form });
      setNotice({ tone: 'success', text: 'Your profile has been updated.' });
      reload();
      refreshUser().catch(() => {});
    } catch (err) {
      setErrors(err.fieldErrors);
      setNotice({ tone: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setPwErrors({});
    setPwNotice(null);
    try {
      const res = await api('/auth/change-password', { method: 'POST', body: pw });
      session.update({ accessToken: res.accessToken, refreshToken: res.refreshToken });
      setPw({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPwNotice({ tone: 'success', text: 'Password changed.' });
    } catch (err) {
      setPwErrors(err.fieldErrors);
      setPwNotice({ tone: 'error', text: err.message });
    }
  };

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Public Profile</h1>
          <p className="dash-page__subtitle">This is what fans see on your public contestant profile.</p>
        </div>
      </div>

      <Notice tone="error">{error?.message}</Notice>
      {me && me.status !== 'ACTIVE' && (
        <Notice tone="info">
          Your profile is {titleCase(me.status)} and is not visible on the website{me.statusReason ? `: ${me.statusReason}` : '.'}
        </Notice>
      )}

      <div className="dash-page__stats">
        {/* Contestants see their level badge, not the exact vote count. */}
        <StatCard icon={Trophy} label="Level" value={me?.level.label ?? '—'} sub="Based on your votes" />
        <StatCard icon={BadgeCheck} label="Verified" value={me ? (me.verified ? 'Yes' : 'Not yet') : '—'} sub={me?.officialNominee ? 'Official Nominee' : undefined} />
        <StatCard icon={ShieldCheck} label="Status" value={me ? titleCase(me.status) : '—'} sub={me?.category.name} />
      </div>

      <div>
        <h2 className="dash-page__section-title">Profile details</h2>
        <Notice tone={notice?.tone}>{notice?.text}</Notice>

        <form className="auth-form" onSubmit={handleSubmit} noValidate style={{ maxWidth: 520 }}>
          <div className="auth-form__row">
            <Field id="c-name" label="Full name" icon={User} error={errors.fullName}>
              <input id="c-name" type="text" value={form.fullName} onChange={update('fullName')} />
            </Field>
            <Field id="c-category" label="Category (changed by admins)" icon={Award} select>
              <select id="c-category" value={me?.category.name ?? ''} disabled>
                <option>{me?.category.name ?? ''}</option>
              </select>
            </Field>
          </div>

          <div className="auth-form__field">
            <label htmlFor="c-bio">Bio</label>
            <div className="auth-form__input-wrap contestant-profile__textarea-wrap">
              <FileText size={16} />
              <textarea id="c-bio" rows={4} value={form.bio} onChange={update('bio')} />
            </div>
            {errors.bio && <span className="auth-form__error">{errors.bio}</span>}
          </div>

          <div className="auth-form__row">
            <Field id="c-instagram" label="Instagram handle" icon={Instagram} error={errors.instagram}>
              <input id="c-instagram" type="text" placeholder="@your.name" value={form.instagram} onChange={update('instagram')} />
            </Field>
            <Field id="c-portfolio" label="Portfolio / website" icon={Link2} error={errors.portfolioUrl}>
              <input id="c-portfolio" type="url" placeholder="https://" value={form.portfolioUrl} onChange={update('portfolioUrl')} />
            </Field>
          </div>

          <Field id="c-video" label="Video link (YouTube / TikTok)" icon={Video} error={errors.videoUrl}>
            <input id="c-video" type="url" placeholder="https://" value={form.videoUrl} onChange={update('videoUrl')} />
          </Field>

          <button type="submit" className="btn btn--gold" style={{ alignSelf: 'flex-start', padding: '10px 24px' }} disabled={saving}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </div>

      <div style={{ marginTop: 32 }}>
        <h2 className="dash-page__section-title">Change password</h2>
        <p className="dash-page__subtitle">If an admin gave you a temporary password, choose your own here.</p>
        <Notice tone={pwNotice?.tone}>{pwNotice?.text}</Notice>
        <form className="auth-form" onSubmit={changePassword} noValidate style={{ maxWidth: 520 }}>
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
    </div>
  );
}
