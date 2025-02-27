/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import liff from '@line/liff';
import config from './constant/config';
import './App.css';

const btnStyle = {
  padding: '10px 20px',
  fontSize: '16px',
  backgroundColor: 'rgb(0, 150, 136)',
  marginBottom: '20px',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [qrCodeData, setQrCodeData] = useState(null);

  const handleOpenCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { exact: 'environment' },
        },
        audio: false,
      });

      const video = videoRef.current;
      video.srcObject = stream;
      video.play();

      // 進行即時 QR 碼掃描
      const intervalId = setInterval(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          setQrCodeData(code.data);
          console.log('QR Code Data:', code.data);

          // clearInterval(intervalId); // 停止掃描
        }
      }, 100); // 每 100 毫秒掃描一次
    } catch (error) {
      console.error('Error opening camera:', error);
    }
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
    <section className='section scanner-container'>
      <h1 className='title'>LINE LIFF 相機測試</h1>

      <button type='button' onClick={handleOpenCamera} style={btnStyle}>
        開啟相機
      </button>

      <video ref={videoRef} autoPlay={true} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {qrCodeData && <p>QR Code Data: {qrCodeData}</p>}
    </section>
  );
}

export default App;
