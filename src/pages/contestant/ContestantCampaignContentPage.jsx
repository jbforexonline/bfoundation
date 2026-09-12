import { useState } from 'react';
import { Megaphone, FileText, Send } from 'lucide-react';
import '../../components/dashboard/DashboardPage.scss';
import '../../components/auth/AuthForm.scss';
import './ContestantCampaignContentPage.scss';

const INITIAL_POSTS = [
  {
    id: 1,
    title: 'New single dropping this Friday!',
    date: '2026-09-08',
    body: 'Thank you all for the votes so far — my new single "Umutima Wanjye" drops this Friday. Every stream and vote means the world.',
  },
  {
    id: 2,
    title: 'Behind the scenes at rehearsal',
    date: '2026-09-02',
    body: 'Getting ready for the Awards Night performance. Sneak peek of the set list coming soon!',
  },
];

export default function ContestantCampaignContentPage() {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [form, setForm] = useState({ title: '', body: '' });

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) return;
    // TODO: send this update to your real "campaign content" endpoint.
    const newPost = {
      id: Date.now(),
      title: form.title,
      body: form.body,
      date: new Date().toISOString().slice(0, 10),
    };
    setPosts((prev) => [newPost, ...prev]);
    setForm({ title: '', body: '' });
  };

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Campaign Content</h1>
          <p className="dash-page__subtitle">Post updates your supporters see on your public profile.</p>
        </div>
      </div>

      <div className="dash-page__card-grid" style={{ gridTemplateColumns: '1fr 1.4fr', alignItems: 'start' }}>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-form__field">
            <label htmlFor="post-title">Update title</label>
            <div className="auth-form__input-wrap">
              <Megaphone size={16} />
              <input
                id="post-title"
                type="text"
                placeholder="What's the headline?"
                value={form.title}
                onChange={update('title')}
              />
            </div>
          </div>

          <div className="auth-form__field">
            <label htmlFor="post-body">Message</label>
            <div className="auth-form__input-wrap campaign-content__textarea-wrap">
              <FileText size={16} />
              <textarea
                id="post-body"
                rows={4}
                placeholder="Share an update with your supporters..."
                value={form.body}
                onChange={update('body')}
              />
            </div>
          </div>

          <button type="submit" className="btn btn--gold auth-form__submit">
            <Send size={15} />
            Post Update
          </button>
        </form>

        <div className="dash-page__list">
          {posts.map((post) => (
            <div className="dash-item" key={post.id}>
              <div className="dash-item__icon">
                <Megaphone size={18} />
              </div>
              <div className="dash-item__body">
                <p className="dash-item__title">{post.title}</p>
                <p className="dash-item__meta">{post.date}</p>
                <p style={{ fontSize: '0.83rem', color: '#a8a49b', marginTop: 6, lineHeight: 1.5 }}>
                  {post.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
