/* eslint-disable no-unused-vars */
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

const link = [
  {
    text: '前往 Migo 官網 ( _blank )',
    type: '_blank',
  },
  {
    text: '前往 Migo 官網 ( _self )',
    type: '_self',
  },
  {
    text: '前往 Migo 官網 ( _parent )',
    type: '_parent',
  },
  {
    text: '前往 Migo 官網 ( _top )',
    type: '_top',
  },
  {
    text: '前往 Migo 官網 ( framename )',
    type: 'framename',
  },
];

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
    <section className='section'>
      <h1 className='title'>GA & UTM</h1>

      <ul className='utm-list'>
        <li>utm_source: {utm?.utm_source}</li>
        <li>utm_medium: {utm?.utm_medium}</li>
        <li>utm_campaign: {utm?.utm_campaign}</li>
        <li>utm_term: {utm?.utm_term}</li>
        <li>utm_content: {utm?.utm_content}</li>
        <li>third_party: {utm?.third_party}</li>
        <li>third_party_id: {utm?.third_party_id}</li>
        <li>device_id: {utm?.device_id}</li>
      </ul>

      <button className='btn btn-test' data-ga-id='button-test'>
        GA Event Test
      </button>

      {link.map((item) => (
        <a
          href='https://www.migocorp.com/'
          className='link'
          target={item.type}
          key={item.type}
        >
          {item.text}
        </a>
      ))}
    </section>
  );
}

export default App;
