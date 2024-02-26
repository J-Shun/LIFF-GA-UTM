import { useEffect, useState } from 'react';
import liff from '@line/liff';
import {
  sendDataToGtm,
  getSessionStorage,
  saveUtm,
  sendUtmToGtm,
} from './helper';
import config from './constant/config';
import './App.css';

function App() {
  const [utm, setUtm] = useState({});

  useEffect(() => {
    const initLiff = async () => {
      try {
        await liff.init({ liffId: config.LIFF_ID });

        saveUtm();

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
        sendUtmToGtm();
        const utmString = getSessionStorage('utm');
        const parsedUtm = JSON.parse(utmString);
        setUtm(parsedUtm);
      } catch (error) {
        alert('error');
        console.log(error);
      }
    };
    initLiff();
  }, []);

  return (
    <>
      <h1>GA & UTM</h1>
      <div>utm_source: {utm?.utm_source}</div>
      <div>utm_medium: {utm?.utm_medium}</div>
      <div>utm_campaign: {utm?.utm_campaign}</div>
      <div>utm_term: {utm?.utm_term}</div>
      <div>utm_content: {utm?.utm_content}</div>
      <button data-ga-id='button-test'>GA Test Event</button>
    </>
  );
}

export default App;
