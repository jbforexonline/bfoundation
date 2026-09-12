import { useState } from 'react';
import { Check, ThumbsUp } from 'lucide-react';
import PageHero from '../components/PageHero';
import './VotePage.scss';

const CATEGORIES = [
  {
    id: 'musician',
    label: 'Best Musician',
    nominees: [
      { id: 'm1', name: 'Malaika Uwase', votes: 18420 },
      { id: 'm2', name: 'Bruce Karenzi', votes: 15310 },
      { id: 'm3', name: 'Diane Iradukunda', votes: 12980 },
      { id: 'm4', name: 'Samuel Bizimana', votes: 9860 },
    ],
  },
  {
    id: 'footballer',
    label: 'Best Footballer',
    nominees: [
      { id: 'f1', name: 'Ishimwe Kevin', votes: 21040 },
      { id: 'f2', name: 'Emmanuel Ndayisenga', votes: 17760 },
      { id: 'f3', name: 'David Habyarimana', votes: 14210 },
    ],
  },
  {
    id: 'influencer',
    label: 'Best Influencer',
    nominees: [
      { id: 'i1', name: 'Grace Umutoni', votes: 13500 },
      { id: 'i2', name: 'Claudine Mukamana', votes: 11890 },
      { id: 'i3', name: 'Aline Mutesi', votes: 10420 },
    ],
  },
  {
    id: 'comedian',
    label: 'Best Comedian',
    nominees: [
      { id: 'c1', name: 'Divine Ingabire', votes: 9640 },
      { id: 'c2', name: 'Sandrine Uwera', votes: 8120 },
      { id: 'c3', name: 'Patrick Habimana', votes: 7530 },
    ],
  },
];

function initials(name) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

export default function VotePage() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const [ballot, setBallot] = useState({}); // { [categoryId]: nomineeId }
  const [voteCounts, setVoteCounts] = useState(() =>
    Object.fromEntries(
      CATEGORIES.flatMap((cat) => cat.nominees.map((n) => [n.id, n.votes]))
    )
  );

  const category = CATEGORIES.find((c) => c.id === activeCategory);
  const votedFor = ballot[activeCategory];

  const castVote = (nomineeId) => {
    if (votedFor) return; // one vote per category in this demo
    setBallot((prev) => ({ ...prev, [activeCategory]: nomineeId }));
    setVoteCounts((prev) => ({ ...prev, [nomineeId]: prev[nomineeId] + 1 }));
    // TODO: send the vote to your backend here.
  };

  return (
    <>
      <PageHero
        eyebrow="Vote"
        title="Cast your vote"
        description="Pick a category and support the nominee you believe deserves it. One vote per category, per person."
      >
        <div className="vote-tabs" role="tablist" aria-label="Award category">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={cat.id === activeCategory}
              className={cat.id === activeCategory ? 'is-active' : ''}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </PageHero>

      <section className="vote-page section">
        <div className="vote-page__inner">
          {votedFor && (
            <p className="vote-page__confirm" role="status">
              <Check size={16} /> Your vote for {category.label} has been recorded. Thank you!
            </p>
          )}

          <div className="vote-page__grid">
            {category.nominees.map((nominee) => {
              const isVoted = votedFor === nominee.id;
              const isDisabled = Boolean(votedFor) && !isVoted;

              return (
                <div
                  className={`vote-page__card ${isVoted ? 'vote-page__card--voted' : ''}`}
                  key={nominee.id}
                >
                  <div className="vote-page__avatar">{initials(nominee.name)}</div>
                  <p className="vote-page__name">{nominee.name}</p>
                  <p className="vote-page__votes">{voteCounts[nominee.id].toLocaleString()} votes</p>
                  <button
                    type="button"
                    className={`btn ${isVoted ? 'btn--gold' : 'btn--outline'} vote-page__btn`}
                    onClick={() => castVote(nominee.id)}
                    disabled={isDisabled}
                  >
                    {isVoted ? (
                      <>
                        <Check size={16} /> Voted
                      </>
                    ) : (
                      <>
                        <ThumbsUp size={16} /> Vote
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
