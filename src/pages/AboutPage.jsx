import { Star, Users2, Sun, Heart } from 'lucide-react';
import PageHero from '../components/PageHero';
import StatsBar from '../components/StatsBar';
import './AboutPage.scss';

const VALUES = [
  { icon: Star, title: 'Recognizing Talent', desc: 'We believe excellence deserves a stage, no matter where it comes from.' },
  { icon: Users2, title: 'Empowering Communities', desc: 'Every vote and nomination strengthens the community behind it.' },
  { icon: Sun, title: 'Inspiring Generations', desc: "Today's winners become tomorrow's role models." },
  { icon: Heart, title: 'Giving Back to Society', desc: 'Recognition comes with real, tangible impact for causes that matter.' },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="Africa's Digital Recognition Platform"
        description="BFOUNDATION.RW exists to celebrate the people building Rwanda's culture, economy, and community — and to give the public a real say in who gets recognized."
      />

      <section className="about-page section">
        <div className="about-page__inner">
          <div className="about-page__story">
            <h2>Our story</h2>
            <p>
              BFOUNDATION started as a simple idea: talent across Rwanda deserves recognition
              that isn&rsquo;t gatekept by industry insiders alone. We built a platform where the
              public nominates, the public votes, and the public decides who stands on stage at
              the end of the year.
            </p>
            <p>
              Since launch, the platform has grown to cover 24+ categories spanning music,
              sport, media, comedy, business, and more — with thousands of contestants and
              hundreds of thousands of votes cast by fans across the region.
            </p>
          </div>

          <div className="about-page__values">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div className="about-page__value-card" key={title}>
                <Icon size={22} />
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <StatsBar />
    </>
  );
}
