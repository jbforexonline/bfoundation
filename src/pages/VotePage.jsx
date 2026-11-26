import { useEffect, useState } from 'react';
import { Check, ThumbsUp } from 'lucide-react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import PageHero from '../components/PageHero';
import Notice from '../components/ui/Notice';
import useApi from '../hooks/useApi';
import { api } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import './VotePage.scss';

function initials(name) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

// Free vote: one per category per person (fan account with a verified email).
export default function VotePage() {
  const { user } = useAuth();
  const { openAuth } = useOutletContext() ?? {};
  const [params] = useSearchParams();
  const { data: catData } = useApi('/categories');
  const categories = (catData?.categories ?? []).filter((c) => c.contestantCount > 0);
  const [activeCategory, setActiveCategory] = useState(params.get('category'));
  const active = categories.find((c) => c.slug === activeCategory) ?? categories[0];
  const { data, loading } = useApi(active ? '/contestants' : null, { category: active?.slug, limit: 100, sort: 'name' });
  const [ballot, setBallot] = useState({}); // { [categorySlug]: contestantId }
  const [notice, setNotice] = useState(null);
  const [sending, setSending] = useState(null);

  // Which categories this fan already used their free vote in.
  useEffect(() => {
    if (user?.role !== 'FAN') return;
    api('/votes/free-status')
      .then((d) =>
        setBallot(Object.fromEntries(d.categories.filter((c) => c.votedFor).map((c) => [c.category.slug, c.votedFor.id])))
      )
      .catch(() => {});
  }, [user]);

  const votedFor = active ? ballot[active.slug] : null;

  const castVote = async (contestant) => {
    setNotice(null);
    if (!user) {
      setNotice({ tone: 'info', text: 'Log in with your fan account to vote.' });
      openAuth?.('login');
      return;
    }
    if (user.role !== 'FAN') {
      setNotice({ tone: 'info', text: 'Only fan accounts can vote.' });
      return;
    }
    setSending(contestant.id);
    try {
      await api('/votes/free', { method: 'POST', body: { contestantId: contestant.id } });
      setBallot((prev) => ({ ...prev, [active.slug]: contestant.id }));
      setNotice({ tone: 'success', text: `Your vote for ${contestant.name} in ${active.name} has been recorded. Thank you!` });
    } catch (err) {
      setNotice({
        tone: 'error',
        text:
          err.code === 'EMAIL_NOT_VERIFIED'
            ? 'Please verify your email address first (check your inbox for the link we sent when you signed up).'
            : err.message,
      });
    } finally {
      setSending(null);
    }
  };

  const contestants = data?.contestants ?? [];

  return (
    <>
      <PageHero
        eyebrow="Vote"
        title="Cast your vote"
        description="Pick a category and support the nominee you believe deserves it. One free vote per category, per person."
      >
        <div className="vote-tabs" role="tablist" aria-label="Award category">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={cat.id === active?.id}
              className={cat.id === active?.id ? 'is-active' : ''}
              onClick={() => {
                setActiveCategory(cat.slug);
                setNotice(null);
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </PageHero>

      <section className="vote-page section">
        <div className="vote-page__inner">
          <Notice tone={notice?.tone}>{notice?.text}</Notice>
          {votedFor && !notice && (
            <p className="vote-page__confirm" role="status">
              <Check size={16} /> You already used your free vote in {active.name}. Thank you!
            </p>
          )}
          {!active && catData && <Notice tone="info">No contestants are open for votes yet.</Notice>}
          {active && loading && <p className="vote-page__votes">Loading contestants…</p>}

          <div className="vote-page__grid">
            {contestants.map((nominee) => {
              const isVoted = votedFor === nominee.id;
              const isDisabled = (Boolean(votedFor) && !isVoted) || sending === nominee.id;

              return (
                <div className={`vote-page__card ${isVoted ? 'vote-page__card--voted' : ''}`} key={nominee.id}>
                  <div className="vote-page__avatar" style={nominee.profileImage ? { padding: 0, overflow: 'hidden' } : undefined}>
                    {nominee.profileImage ? (
                      <img src={nominee.profileImage} alt={nominee.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      initials(nominee.name)
                    )}
                  </div>
                  <p className="vote-page__name">{nominee.name}</p>
                  {/* Level badge instead of the vote count (exact counts are admin-only). */}
                  <p className="vote-page__votes">{nominee.level.label}</p>
                  <button
                    type="button"
                    className={`btn ${isVoted ? 'btn--gold' : 'btn--outline'} vote-page__btn`}
                    onClick={() => castVote(nominee)}
                    disabled={isDisabled || isVoted}
                  >
                    {isVoted ? (
                      <>
                        <Check size={16} /> Voted
                      </>
                    ) : (
                      <>
                        <ThumbsUp size={16} /> {sending === nominee.id ? 'Voting…' : 'Vote'}
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
