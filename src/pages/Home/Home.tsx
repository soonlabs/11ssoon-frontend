import Actions from './Actions';
import Dashboard from './Dashboard';
import Footer from './Footer';
import Header from './Header';
import Result from './Result';
import Summary from './Summary';

import useBettingStatusStore from '@/store/useBettingStatusStore';
import HomeBg1 from '@/assets/home-bg-1.gif';
import HomeBg2 from '@/assets/home-bg-2.gif';
import HomeBg3 from '@/assets/home-bg-3.gif';

function Home() {
  const isBetting = useBettingStatusStore(state => state.isBetting);
  const bettingResult = useBettingStatusStore(state => state.bettingResult);

  const showStarsRain = isBetting && bettingResult === 'win';

  const backgrounds = [HomeBg1, HomeBg2, HomeBg3];
  const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];

  return (
    <div className="relative flex min-h-screen flex-col items-center gap-10 px-4 py-[50px]">
      <div className="xs:w-[500px] xs:p-6 xs:pb-10 z-10 flex w-full flex-col gap-6 rounded-3xl bg-[#292929] p-4">
        <Header />
        <Summary />
        <Dashboard />
        <Result />
        <Actions />
        <Footer />
      </div>

      {showStarsRain && (
        <div
          className="animate-stars-rain absolute inset-0 z-0 opacity-60"
          style={{
            backgroundImage: `url(${randomBg})`,
            backgroundRepeat: 'repeat',
          }}
        />
      )}
    </div>
  );
}

export default Home;
