import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ThumbsUp, Check, Megaphone } from 'lucide-react';
import PageHero from '../components/PageHero';
import './CommunityNominationsPage.scss';

const INITIAL_NOMINATIONS = [
  {
    id: 'n1',
    name: 'Yves Mugenzi',
    category: 'Best Journalist',
    reason: 'Broke the story on rural healthcare access and pushed real policy change.',
    supporters: 214,
  },
  {
    id: 'n2',
    name: 'Immaculee Nyirahabimana',
    category: 'Entrepreneur',
    reason: 'Built a cooperative that now employs over 60 women in Huye district.',
    supporters: 189,
  },
  {
    id: 'n3',
    name: 'Placide Rukundo',
    category: 'Best Dancer',
    reason: 'Choreographed the Intore revival performances touring secondary schools nationwide.',
    supporters: 132,
  },
  {
    id: 'n4',
    name: 'Chantal Mukashyaka',
    category: 'Best Influencer',
    reason: 'Uses her platform to promote Kinyarwanda literacy for young children.',
    supporters: 97,
  },
];

export default function CommunityNominationsPage() {
  const [nominations, setNominations] = useState(INITIAL_NOMINATIONS);
  const [supported, setSupported] = useState({});

  const support = (id) => {
    if (supported[id]) return;
    setSupported((prev) => ({ ...prev, [id]: true }));
    setNominations((prev) =>
      prev.map((n) => (n.id === id ? { ...n, supporters: n.supporters + 1 } : n))
    );
    // TODO: send this support/endorsement to your backend.
  };

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
          <div className="community-noms__grid">
            {nominations.map((n) => (
              <div className="community-noms__card" key={n.id}>
                <p className="community-noms__category">{n.category}</p>
                <h3>{n.name}</h3>
                <p className="community-noms__reason">{n.reason}</p>

                <div className="community-noms__footer">
                  <span className="community-noms__count">{n.supporters} supporters</span>
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
