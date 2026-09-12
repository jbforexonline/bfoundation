import { Users2, ShieldCheck, Vote, Trophy, HeartHandshake, ChevronRight } from 'lucide-react';
import './HowItWorks.scss';

const STEPS = [
  { icon: Users2, title: 'Nominate', desc: 'Community suggests and nominates talents.' },
  { icon: ShieldCheck, title: 'Review', desc: 'Our team reviews and approves.' },
  { icon: Vote, title: 'Vote', desc: 'Fans vote for their favorites.' },
  { icon: Trophy, title: 'Win', desc: 'Winners are celebrated and rewarded.' },
  { icon: HeartHandshake, title: 'Give Back', desc: 'We support charity projects through your generosity.' },
];

export default function HowItWorks() {
  return (
    <section className="how-it-works section">
      <div className="how-it-works__inner">
        <h2 className="how-it-works__title">How It Works</h2>

        <div className="how-it-works__steps">
          {STEPS.map(({ icon: Icon, title, desc }, i) => (
            <div className="how-it-works__step" key={title}>
              <div className="how-it-works__icon">
                <Icon size={22} />
              </div>
              <p className="how-it-works__step-title">{title}</p>
              <p className="how-it-works__step-desc">{desc}</p>
              {i < STEPS.length - 1 && (
                <ChevronRight size={18} className="how-it-works__arrow" aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
