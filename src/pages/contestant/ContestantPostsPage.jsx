import { useState } from 'react';
import { Megaphone, FileText, Send, Heart, MessageCircle, Trash2, Pencil, X } from 'lucide-react';
import Notice from '../../components/ui/Notice';
import useApi from '../../hooks/useApi';
import { api, timeAgo } from '../../api/client';
import '../../components/dashboard/DashboardPage.scss';
import '../../components/auth/AuthForm.scss';
import './ContestantPostsPage.scss';

// Campaign updates. Fans who follow the contestant are notified; fans react and comment.
export default function ContestantPostsPage() {
  const { data, error, reload } = useApi('/contestants/me/posts', { limit: 50 });
  const [form, setForm] = useState({ title: '', body: '' });
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState(null);
  const [saving, setSaving] = useState(false);
  const [comments, setComments] = useState({}); // postId -> list (expanded)

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setNotice(null);
    try {
      const d = editingId
        ? await api(`/contestants/me/posts/${editingId}`, { method: 'PATCH', body: form })
        : await api('/contestants/me/posts', { method: 'POST', body: form });
      setNotice({ tone: 'success', text: editingId ? 'Post updated.' : `${d._message} Your followers were notified.` });
      setForm({ title: '', body: '' });
      setEditingId(null);
      reload();
    } catch (err) {
      setErrors(err.fieldErrors);
      setNotice({ tone: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (post) => {
    if (!window.confirm(`Delete "${post.title}"?`)) return;
    try {
      await api(`/contestants/me/posts/${post.id}`, { method: 'DELETE' });
      reload();
    } catch (err) {
      setNotice({ tone: 'error', text: err.message });
    }
  };

  const toggleComments = async (post) => {
    if (comments[post.id]) {
      setComments(({ [post.id]: _, ...rest }) => rest);
      return;
    }
    try {
      const d = await api(`/posts/${post.id}/comments`, { query: { limit: 50 } });
      setComments((c) => ({ ...c, [post.id]: d.comments }));
    } catch (err) {
      setNotice({ tone: 'error', text: err.message });
    }
  };

  const deleteComment = async (post, comment) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await api(`/posts/${post.id}/comments/${comment.id}`, { method: 'DELETE' });
      setComments((c) => ({ ...c, [post.id]: c[post.id].filter((x) => x.id !== comment.id) }));
      reload();
    } catch (err) {
      setNotice({ tone: 'error', text: err.message });
    }
  };

  const posts = data?.posts ?? [];

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Posts</h1>
          <p className="dash-page__subtitle">Post updates your supporters see on your profile. Followers get a notification.</p>
        </div>
      </div>

      <Notice tone={notice?.tone}>{notice?.text}</Notice>
      <Notice tone="error">{error?.message}</Notice>

      <div className="dash-page__card-grid" style={{ gridTemplateColumns: '1fr 1.4fr', alignItems: 'start' }}>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-form__field">
            <label htmlFor="post-title">{editingId ? 'Edit title' : 'Update title'}</label>
            <div className="auth-form__input-wrap">
              <Megaphone size={16} />
              <input id="post-title" type="text" placeholder="What's the headline?" value={form.title} onChange={update('title')} />
            </div>
            {errors.title && <span className="auth-form__error">{errors.title}</span>}
          </div>

          <div className="auth-form__field">
            <label htmlFor="post-body">Message</label>
            <div className="auth-form__input-wrap posts-page__textarea-wrap">
              <FileText size={16} />
              <textarea id="post-body" rows={4} placeholder="Share an update with your supporters..." value={form.body} onChange={update('body')} />
            </div>
            {errors.body && <span className="auth-form__error">{errors.body}</span>}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" className="btn btn--gold auth-form__submit" disabled={saving}>
              <Send size={15} />
              {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Post Update'}
            </button>
            {editingId && (
              <button type="button" className="btn btn--outline" onClick={() => { setEditingId(null); setForm({ title: '', body: '' }); }}>
                <X size={15} /> Cancel
              </button>
            )}
          </div>
        </form>

        <div className="dash-page__list">
          {posts.length === 0 && <p style={{ color: '#a8a49b' }}>No posts yet. Your first update will appear here.</p>}
          {posts.map((post) => (
            <div className="dash-item" key={post.id} style={{ alignItems: 'flex-start' }}>
              <div className="dash-item__icon">
                <Megaphone size={18} />
              </div>
              <div className="dash-item__body">
                <p className="dash-item__title">{post.title}</p>
                <p className="dash-item__meta">{timeAgo(post.createdAt)}</p>
                <p style={{ fontSize: '0.83rem', color: '#a8a49b', marginTop: 6, lineHeight: 1.5, whiteSpace: 'pre-line' }}>{post.body}</p>
                <div style={{ display: 'flex', gap: 14, marginTop: 8, fontSize: '0.8rem', color: '#a8a49b', alignItems: 'center' }}>
                  <span><Heart size={13} style={{ verticalAlign: -2 }} /> {post.reactions}</span>
                  <button type="button" onClick={() => toggleComments(post)} style={{ background: 'none', border: 0, color: '#f0a93a', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}>
                    <MessageCircle size={13} style={{ verticalAlign: -2 }} /> {post.comments} comment{post.comments === 1 ? '' : 's'}
                  </button>
                </div>
                {comments[post.id] && (
                  <div style={{ marginTop: 8, display: 'grid', gap: 6 }}>
                    {comments[post.id].length === 0 && <p style={{ fontSize: '0.8rem', color: '#78746c' }}>No comments yet.</p>}
                    {comments[post.id].map((c) => (
                      <p key={c.id} style={{ fontSize: '0.8rem', color: '#cfcac0' }}>
                        <strong>{c.author}:</strong> {c.body}{' '}
                        <span style={{ color: '#78746c' }}>· {timeAgo(c.createdAt)}</span>{' '}
                        <button type="button" onClick={() => deleteComment(post, c)} aria-label="Delete comment" style={{ background: 'none', border: 0, color: '#78746c', cursor: 'pointer' }}>
                          <Trash2 size={12} />
                        </button>
                      </p>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button type="button" className="btn btn--outline dash-item__action" aria-label="Edit" onClick={() => { setEditingId(post.id); setForm({ title: post.title, body: post.body }); }}>
                  <Pencil size={14} />
                </button>
                <button type="button" className="btn btn--outline dash-item__action" aria-label="Delete" onClick={() => remove(post)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
