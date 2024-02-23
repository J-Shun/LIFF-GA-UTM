import { useEffect } from 'react';
import liff from '@line/liff';
import { sendDataToGtm } from './helper';
import config from './constant/config';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  useEffect(() => {
    const initLiff = async () => {
      try {
        await liff.init({ liffId: '2003704225-2ApWgyz8' });

        // 若無登入，則跳制登入頁面
        if (!liff.isLoggedIn()) {
          liff.login();
          return;
        }

        const profile = await liff.getProfile();
        const lineUid = profile.userId;

        // 配合 GTM 那邊做的特殊設置
        sendDataToGtm({ event: 'setLineUid', key: 'lineUid', value: lineUid });
        sendDataToGtm({
          event: 'setGaTrackingId',
          key: 'gaTrackingId',
          value: config.GA4_TRACKING_ID,
        });
      } catch (error) {
        alert('error');
        console.log(error);
      }
    };
    initLiff();
  }, []);

  return (
    <>
      <div>
        <a href='https://vitejs.dev' target='_blank'>
          <img src={viteLogo} className='logo' alt='Vite logo' />
        </a>
        <a href='https://react.dev' target='_blank'>
          <img src={reactLogo} className='logo react' alt='React logo' />
        </a>
      </div>
      <h1>GA & UTM</h1>
    </>
  );
}

export default App;
