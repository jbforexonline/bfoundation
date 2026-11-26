import { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { ThumbsUp, Check, Megaphone } from 'lucide-react';
import PageHero from '../components/PageHero';
import Notice from '../components/ui/Notice';
import useApi from '../hooks/useApi';
import { api } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import './CommunityNominationsPage.scss';

export default function CommunityNominationsPage() {
  const { user } = useAuth();
  const { openAuth } = useOutletContext() ?? {};
  const { data, error, loading } = useApi('/nominations', { limit: 60 });
  const [counts, setCounts] = useState({}); // live supporter counts after supporting
  const [supported, setSupported] = useState({});
  const [notice, setNotice] = useState(null);

  // Mark the ones this fan already supported.
  useEffect(() => {
    if (user?.role !== 'FAN') return;
    api('/nominations/supported')
      .then((d) => setSupported(Object.fromEntries(d.nominations.map((x) => [x.nomination.id, true]))))
      .catch(() => {});
  }, [user]);

  const support = async (id) => {
    setNotice(null);
    if (!user) {
      setNotice({ tone: 'info', text: 'Log in as a fan to support a nomination.' });
      openAuth?.('login');
      return;
    }
    if (user.role !== 'FAN') {
      setNotice({ tone: 'info', text: 'Only fan accounts can support nominations.' });
      return;
    }
    try {
      const res = await api(`/nominations/${id}/support`, { method: 'POST', body: { type: 'free' } });
      setSupported((prev) => ({ ...prev, [id]: true }));
      setCounts((prev) => ({ ...prev, [id]: res.nomination.supporters }));
      setNotice({ tone: 'success', text: 'Thanks for your support!' });
    } catch (err) {
      if (err.code === 'ALREADY_SUPPORTED') setSupported((prev) => ({ ...prev, [id]: true }));
      setNotice({ tone: err.code === 'ALREADY_SUPPORTED' ? 'info' : 'error', text: err.message });
    }
  };

  const nominations = (data?.nominations ?? []).map((n) => ({
    id: n.id,
    name: n.nomineeName,
    category: n.category.name,
    reason: n.reason,
    supporters: counts[n.id] ?? n.supporters,
    qualified: n.status === 'QUALIFIED_FOR_REVIEW',
  }));

  return (
    <>
      <PageHero
        eyebrow="Community Nomination System"
        title="Nominations from the community, for the community"
        description="Anyone can put someone forward. The nominations with the most community support move on to the public ballot."
      >
        <Link to="/nominate" className="btn btn--gold">
          <Megaphone size={16} />
          Suggest a Contestant
        </Link>
      </PageHero>

      <section className="community-noms section">
        <div className="community-noms__inner">
          <Notice tone={notice?.tone}>{notice?.text}</Notice>
          <Notice tone="error">{error?.message}</Notice>
          {!loading && !error && nominations.length === 0 && (
            <Notice tone="info">No open nominations yet. Be the first to suggest someone!</Notice>
          )}
          <div className="community-noms__grid">
            {nominations.map((n) => (
              <div className="community-noms__card" key={n.id}>
                <p className="community-noms__category">{n.category}</p>
                <h3>{n.name}</h3>
                <p className="community-noms__reason">{n.reason}</p>

                <div className="community-noms__footer">
                  <span className="community-noms__count">
                    {n.supporters} supporter{n.supporters === 1 ? '' : 's'}
                    {n.qualified ? ' · in review' : ''}
                  </span>
                  <button
                    type="button"
                    className={`btn ${supported[n.id] ? 'btn--outline' : 'btn--gold'} community-noms__support`}
                    onClick={() => support(n.id)}
                    disabled={supported[n.id]}
                  >
                    {supported[n.id] ? (
                      <>
                        <Check size={15} /> Supported
                      </>
                    ) : (
                      <>
                        <ThumbsUp size={15} /> Support
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
