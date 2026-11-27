import { useState } from 'react';
import { Inbox, Mail, Send, Megaphone, CheckCircle2, Users, Clock3, Link2, Trash2 } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Field from '../../components/ui/Field';
import Notice from '../../components/ui/Notice';
import useApi from '../../hooks/useApi';
import { api, formatDate, formatDateTime, timeAgo, titleCase } from '../../api/client';
import { useAuth } from '../../auth/AuthContext';
import '../../components/auth/AuthForm.scss';
import '../../components/dashboard/DashboardPage.scss';

const TONE = { NEW: 'gold', READ: 'neutral', REPLIED: 'success', CLOSED: 'neutral', ACTIVE: 'success', PENDING: 'warning', UNSUBSCRIBED: 'danger' };
const small = { padding: '6px 12px', fontSize: '0.78rem' };
const textarea = {
  width: '100%',
  background: 'transparent',
  border: 'none',
  color: 'inherit',
  font: 'inherit',
  resize: 'vertical',
  outline: 'none',
};

function ContactTab({ isAdmin }) {
  const [status, setStatus] = useState('');
  const { data, error, loading, reload } = useApi('/admin/contact-messages', { limit: 100, status: status || undefined });
  const [notice, setNotice] = useState(null);
  const [open, setOpen] = useState(null);
  const [reply, setReply] = useState('');
  const [closeAfter, setCloseAfter] = useState(false);
  const [sending, setSending] = useState(false);
  const [replyError, setReplyError] = useState('');

  const view = async (m) => {
    setReply('');
    setReplyError('');
    setCloseAfter(false);
    try {
      const d = await api(`/admin/contact-messages/${m.id}`); // marks it READ
      setOpen(d.message);
      reload();
    } catch (err) {
      setNotice({ tone: 'error', text: err.message });
    }
  };

  const sendReply = async (e) => {
    e.preventDefault();
    setSending(true);
    setReplyError('');
    try {
      const d = await api(`/admin/contact-messages/${open.id}/reply`, { method: 'POST', body: { reply, close: closeAfter } });
      setNotice({ tone: 'success', text: d._message });
      setOpen(null);
      reload();
    } catch (err) {
      setReplyError(err.fieldErrors?.reply || err.message);
    } finally {
      setSending(false);
    }
  };

  const changeStatus = async (m, next) => {
    try {
      const d = await api(`/admin/contact-messages/${m.id}/status`, { method: 'PATCH', body: { status: next } });
      setNotice({ tone: 'success', text: d._message });
      setOpen(null);
      reload();
    } catch (err) {
      setNotice({ tone: 'error', text: err.message });
    }
  };

  const remove = async (m) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await api(`/admin/contact-messages/${m.id}`, { method: 'DELETE' });
      setOpen(null);
      reload();
    } catch (err) {
      setNotice({ tone: 'error', text: err.message });
    }
  };

  const st = data?.stats;
  const rows = (data?.messages ?? []).map((m) => ({ id: m.id, from: m.name, email: m.email, subject: m.subject, status: m.status, raw: m }));

  return (
    <>
      <Notice tone={notice?.tone}>{notice?.text}</Notice>
      <Notice tone="error">{error?.message}</Notice>
      <div className="dash-page__stats">
        <StatCard icon={Inbox} label="New messages" value={st?.new ?? '—'} />
        <StatCard icon={Clock3} label="Read, not answered" value={st?.read ?? '—'} />
        <StatCard icon={CheckCircle2} label="Replied / closed" value={st ? st.replied + st.closed : '—'} />
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        {['', 'NEW', 'READ', 'REPLIED', 'CLOSED'].map((v) => (
          <button key={v} type="button" className={`btn ${status === v ? 'btn--gold' : 'btn--outline'}`} style={small} onClick={() => setStatus(v)}>
            {v ? titleCase(v) : 'All'}
          </button>
        ))}
      </div>
      <DataTable
        emptyLabel={loading ? 'Loading…' : 'No messages. They arrive from the website’s Contact Us page.'}
        columns={[
          { key: 'from', label: 'From' },
          { key: 'email', label: 'Email' },
          { key: 'subject', label: 'Subject', render: (row) => <strong style={{ fontWeight: row.status === 'NEW' ? 700 : 400 }}>{row.subject}</strong> },
          { key: 'date', label: 'Received', render: (row) => timeAgo(row.raw.createdAt) },
          { key: 'status', label: 'Status', render: (row) => <Badge tone={TONE[row.status]}>{titleCase(row.status)}</Badge> },
          {
            key: 'actions',
            label: '',
            render: (row) => (
              <button type="button" className="btn btn--outline" style={small} onClick={() => view(row.raw)}>
                <Mail size={14} /> Open
              </button>
            ),
          },
        ]}
        rows={rows}
      />

      <Modal isOpen={Boolean(open)} title={open?.subject ?? ''} onClose={() => setOpen(null)}>
        {open && (
          <div style={{ display: 'grid', gap: 12 }}>
            <p style={{ fontSize: '0.85rem', color: '#a8a49b' }}>
              From <strong style={{ color: '#e9e6df' }}>{open.name}</strong> ({open.email}) · {formatDateTime(open.createdAt)}
              {open.fromAccount ? ` · logged in as ${titleCase(open.fromAccount.role ?? 'user')}` : ''}
            </p>
            <p style={{ whiteSpace: 'pre-line', fontSize: '0.9rem', lineHeight: 1.55 }}>{open.message}</p>
            {open.reply && (
              <div style={{ borderLeft: '3px solid #3ec95f', paddingLeft: 12 }}>
                <p style={{ fontSize: '0.8rem', color: '#a8a49b' }}>
                  Replied by {open.repliedBy} · {formatDateTime(open.repliedAt)}
                </p>
                <p style={{ whiteSpace: 'pre-line', fontSize: '0.88rem' }}>{open.reply}</p>
              </div>
            )}
            <form className="auth-form" onSubmit={sendReply} noValidate>
              <Notice tone="error">{replyError}</Notice>
              <Field id="reply" label={open.reply ? 'Send another reply' : `Reply to ${open.email}`}>
                <textarea id="reply" rows={4} style={textarea} value={reply} onChange={(e) => setReply(e.target.value)} />
              </Field>
              <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.85rem' }}>
                <input type="checkbox" checked={closeAfter} onChange={(e) => setCloseAfter(e.target.checked)} /> Close the conversation after replying
              </label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button type="submit" className="btn btn--gold" disabled={sending}>
                  <Send size={15} /> {sending ? 'Sending…' : 'Send reply by email'}
                </button>
                {open.status !== 'CLOSED' ? (
                  <button type="button" className="btn btn--outline" onClick={() => changeStatus(open, 'CLOSED')}>
                    Close without replying
                  </button>
                ) : (
                  <button type="button" className="btn btn--outline" onClick={() => changeStatus(open, 'READ')}>
                    Reopen
                  </button>
                )}
                {isAdmin && (
                  <button type="button" className="btn btn--outline" onClick={() => remove(open)} aria-label="Delete">
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </Modal>
    </>
  );
}

function NewsletterTab({ isAdmin }) {
  const { data, error, loading } = useApi('/admin/newsletter', { limit: 100 });
  const [form, setForm] = useState({ subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState(null);
  const [sending, setSending] = useState(false);

  const send = async (e) => {
    e.preventDefault();
    if (!window.confirm(`Send "${form.subject}" to ${data?.stats.active ?? 0} subscriber(s)?`)) return;
    setSending(true);
    setErrors({});
    setNotice(null);
    try {
      const d = await api('/admin/newsletter/send', { method: 'POST', body: form });
      setNotice({ tone: 'success', text: d._message });
      setForm({ subject: '', message: '' });
    } catch (err) {
      setErrors(err.fieldErrors);
      setNotice({ tone: 'error', text: err.message });
    } finally {
      setSending(false);
    }
  };

  const st = data?.stats;
  const rows = (data?.subscribers ?? []).map((s) => ({ id: s.id, email: s.email, status: s.status, raw: s }));
  return (
    <>
      <Notice tone="error">{error?.message}</Notice>
      <div className="dash-page__stats">
        <StatCard icon={Users} label="Subscribers" value={st?.active ?? '—'} sub="Confirmed their email" />
        <StatCard icon={Clock3} label="Waiting for confirmation" value={st?.pending ?? '—'} />
        <StatCard icon={Mail} label="Unsubscribed" value={st?.unsubscribed ?? '—'} />
      </div>
      {isAdmin && (
        <div style={{ marginBottom: 24 }}>
          <h2 className="dash-page__section-title">Send a newsletter</h2>
          <Notice tone={notice?.tone}>{notice?.text}</Notice>
          <form className="auth-form" onSubmit={send} noValidate style={{ maxWidth: 620 }}>
            <Field id="nl-subject" label="Subject" icon={Megaphone} error={errors.subject}>
              <input id="nl-subject" type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            </Field>
            <Field id="nl-message" label="Message (plain text)" error={errors.message}>
              <textarea id="nl-message" rows={6} style={textarea} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </Field>
            <p style={{ color: '#a8a49b', fontSize: '0.8rem' }}>Each email includes an unsubscribe link.</p>
            <button type="submit" className="btn btn--gold" style={{ alignSelf: 'flex-start' }} disabled={sending || !st?.active}>
              <Send size={15} /> {sending ? 'Sending…' : `Send to ${st?.active ?? 0} subscriber(s)`}
            </button>
          </form>
        </div>
      )}
      <DataTable
        emptyLabel={loading ? 'Loading…' : 'No subscribers yet. People subscribe from the website footer.'}
        columns={[
          { key: 'email', label: 'Email' },
          { key: 'status', label: 'Status', render: (row) => <Badge tone={TONE[row.status]}>{titleCase(row.status)}</Badge> },
          { key: 'since', label: 'Subscribed', render: (row) => formatDate(row.raw.confirmedAt ?? row.raw.createdAt) },
        ]}
        rows={rows}
      />
    </>
  );
}

function AnnouncementTab() {
  const [form, setForm] = useState({ audience: 'ALL', title: '', message: '', link: '' });
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState(null);
  const [sending, setSending] = useState(false);

  const send = async (e) => {
    e.preventDefault();
    setSending(true);
    setErrors({});
    setNotice(null);
    try {
      const d = await api('/admin/notifications/broadcast', { method: 'POST', body: form });
      setNotice({ tone: 'success', text: d._message });
      setForm({ audience: form.audience, title: '', message: '', link: '' });
    } catch (err) {
      setErrors(err.fieldErrors);
      setNotice({ tone: 'error', text: err.message });
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <p style={{ color: '#a8a49b', fontSize: '0.88rem', marginBottom: 16, maxWidth: 620 }}>
        Announcements appear in the Notifications page (and the bell) of fans and/or contestants.
      </p>
      <Notice tone={notice?.tone}>{notice?.text}</Notice>
      <form className="auth-form" onSubmit={send} noValidate style={{ maxWidth: 620 }}>
        <Field id="an-aud" label="Send to" icon={Users} error={errors.audience} select>
          <select id="an-aud" value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })}>
            <option value="ALL">Fans and contestants</option>
            <option value="FANS">Fans only</option>
            <option value="CONTESTANTS">Contestants only</option>
          </select>
        </Field>
        <Field id="an-title" label="Title" icon={Megaphone} error={errors.title}>
          <input id="an-title" type="text" placeholder="e.g. Voting for Best DJ closes Friday" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </Field>
        <Field id="an-msg" label="Details (optional)" error={errors.message}>
          <textarea id="an-msg" rows={3} style={textarea} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        </Field>
        <Field id="an-link" label="Open this page when clicked (optional)" icon={Link2} error={errors.link}>
          <input id="an-link" type="text" placeholder="/vote" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} />
        </Field>
        <button type="submit" className="btn btn--gold" style={{ alignSelf: 'flex-start' }} disabled={sending}>
          <Send size={15} /> {sending ? 'Sending…' : 'Send announcement'}
        </button>
      </form>
    </div>
  );
}

export default function AdminInboxPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const [tab, setTab] = useState('contact');
  const tabs = [
    ['contact', 'Contact messages'],
    ['newsletter', 'Newsletter'],
    ...(isAdmin ? [['announce', 'Announcements']] : []),
  ];
  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Inbox &amp; Newsletter</h1>
          <p className="dash-page__subtitle">Messages from the Contact Us page, newsletter subscribers and in-app announcements.</p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {tabs.map(([k, l]) => (
          <button key={k} type="button" className={`btn ${tab === k ? 'btn--gold' : 'btn--outline'}`} onClick={() => setTab(k)}>
            {l}
          </button>
        ))}
      </div>
      {tab === 'contact' && <ContactTab isAdmin={isAdmin} />}
      {tab === 'newsletter' && <NewsletterTab isAdmin={isAdmin} />}
      {tab === 'announce' && <AnnouncementTab />}
    </div>
  );
}
