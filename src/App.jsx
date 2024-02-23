import { useEffect } from 'react';
import liff from '@line/liff';
import {
  sendDataToGtm,
  parseQueryString,
  setSessionStorage,
  getSessionStorage,
} from './helper';
import config from './constant/config';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const utmString = getSessionStorage('utm');
  const utm = JSON.parse(utmString);

  useEffect(() => {
    const initLiff = async () => {
      try {
        await liff.init({ liffId: '2003704225-2ApWgyz8' });

        const { search } = window.location;
        const queryString = parseQueryString(search);
        const { utm_source, utm_medium, utm_campaign, utm_term, utm_content } =
          queryString;
        const utm = {
          utm_source: utm_source ?? '',
          utm_medium: utm_medium ?? '',
          utm_campaign: utm_campaign ?? '',
          utm_term: utm_term ?? '',
          utm_content: utm_content ?? '',
        };
        setSessionStorage('utm', JSON.stringify(utm));

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
      <div>{utm.utm_source}</div>
      <div>{utm.utm_medium}</div>
      <div>{utm.utm_campaign}</div>
      <div>{utm.utm_term}</div>
      <div>{utm.utm_content}</div>
    </>
  );
}

export default App;
