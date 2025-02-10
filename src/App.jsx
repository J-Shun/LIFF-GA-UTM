/* eslint-disable no-unused-vars */
import { useEffect } from 'react';
import liff from '@line/liff';
import config from './constant/config';
import './App.css';

function App() {
  const handleScan = () => {
    liff
      .scanCodeV2()
      .then((result) => {
        const { value } = result;
        console.log(value);
        alert(value);
      })
      .catch((error) => {
        alert(error);
      });
  };

  useEffect(() => {
    const initLiff = async () => {
      try {
        await liff.init({ liffId: config.LIFF_ID });
        // 若無登入，則跳制登入頁面
        if (!liff.isLoggedIn()) {
          liff.login();
          return;
        }
      } catch (error) {
        console.log(error);
      }
    };
    initLiff();
  }, []);

  return (
    <section className='section'>
      <h1 className='title'>LINE LIFF 相機測試</h1>

      <button
        onClick={handleScan}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: 'rgb(0, 150, 136)',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        LIFF 掃描
      </button>
    </section>
  );
}

export default App;
