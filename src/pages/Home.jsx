import Hero from '../components/Hero';
import StatsBar from '../components/StatsBar';
import FanChallenge from '../components/FanChallenge';
import Categories from '../components/Categories';
import ExploreMore from '../components/ExploreMore';
import GiveBack from '../components/GiveBack';
import HowItWorks from '../components/HowItWorks';

export default function Home() {
  return (
    <>
      <Hero />
      <StatsBar />
      <FanChallenge />
      <Categories />
      <ExploreMore />
      <GiveBack />
      <HowItWorks />
    </>
  );
}
