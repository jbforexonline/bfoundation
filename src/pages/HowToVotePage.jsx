import { useState } from 'react';
import { UserPlus, Search, ThumbsUp, BellRing, ChevronDown } from 'lucide-react';
import PageHero from '../components/PageHero';
import './HowToVotePage.scss';

const STEPS = [
  {
    icon: UserPlus,
    title: 'Create an account',
    desc: 'Sign up with your email and phone number so we can verify one vote per person, per category.',
  },
  {
    icon: Search,
    title: 'Find your category',
    desc: 'Browse the categories or search for the nominee you want to support.',
  },
  {
    icon: ThumbsUp,
    title: 'Cast your vote',
    desc: 'Select your favorite nominee and confirm. You can vote once per category during the voting window.',
  },
  {
    icon: BellRing,
    title: 'Follow the results',
    desc: "Track standings live, and get notified when voting closes and winners are announced.",
  },
];

const FAQS = [
  {
    q: 'How many times can I vote?',
    a: 'You can cast one vote per category for the duration of the competition. Your account keeps track of which categories you have already voted in.',
  },
  {
    q: 'Is voting free?',
    a: 'Yes. Voting on BFOUNDATION.RW is completely free — you just need a verified account.',
  },
  {
    q: 'When does voting close?',
    a: 'Each competition runs for one month. The exact countdown is shown on the home page and on each category.',
  },
  {
    q: 'Can I change my vote after submitting?',
    a: 'No — votes are final once submitted, so take a moment to review your choice before confirming.',
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item ${open ? 'is-open' : ''}`}>
      <button type="button" className="faq-item__question" onClick={() => setOpen((v) => !v)}>
        {q}
        <ChevronDown size={18} />
      </button>
      {open && <p className="faq-item__answer">{a}</p>}
    </div>
  );
}

export default function HowToVotePage() {
  return (
    <>
      <PageHero
        eyebrow="How to Vote"
        title="Four steps to support your favorite"
        description="Voting is free, fast, and takes less than a minute once you're signed in."
      />

      <section className="htv-steps section">
        <div className="htv-steps__inner">
          {STEPS.map(({ icon: Icon, title, desc }, i) => (
            <div className="htv-steps__card" key={title}>
              <span className="htv-steps__index">{i + 1}</span>
              <div className="htv-steps__icon">
                <Icon size={22} />
              </div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="htv-faq section">
        <div className="htv-faq__inner">
          <h2>Frequently asked questions</h2>
          <div className="htv-faq__list">
            {FAQS.map((item) => (
              <FaqItem key={item.q} {...item} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
