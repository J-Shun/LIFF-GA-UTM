/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import liff from '@line/liff';
import config from './constant/config';
import './App.css';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import { Scanner } from '@yudiel/react-qr-scanner';

const btnStyle = {
  padding: '10px 20px',
  fontSize: '16px',
  backgroundColor: 'rgb(0, 150, 136)',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

function boundingBox(detectedCodes, ctx) {
  for (const detectedCode of detectedCodes) {
    const {
      boundingBox: { x, y, width, height },
    } = detectedCode;

    ctx.lineWidth = 2;
    ctx.strokeStyle = 'yellow';
    ctx.strokeRect(x, y, width, height);
  }
}

function App() {
  const [isShowBarcodeScanner, setIsShowBarcodeScanner] = useState(false);
  const [isShowVideo, setIsShowVideo] = useState(false);
  const [data, setData] = useState(null);

  const handleCodeV2 = () => {
    liff
      .scanCodeV2()
      .then((result) => {
        const { value } = result;
        console.log(value);
        setData(value);
      })
      .catch((error) => {
        alert('掃描失敗');
      });
  };

  const handleVideo = (result) => {
    console.log(result);
    if (!result) return;

    const invoiceRegex = /^[A-Z]{2}\d{8}.*$/;
    const isInvoice = invoiceRegex.test(result[0].rawValue);

    if (!isInvoice) return;

    const invoiceNumber = result[0].rawValue.substring(0, 10);
    setData(invoiceNumber);
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

      {!isShowBarcodeScanner && (
        <div style={{ display: 'flex', gap: '10px' }}>
          {/* <button onClick={handleCodeV2} style={btnStyle}>
            scanCodeV2
          </button> */}

          <button onClick={() => setIsShowVideo(true)} style={btnStyle}>
            開啟相機
          </button>
        </div>
      )}

      {/* {isShowBarcodeScanner && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div className='camera__box'>
            <span />
            <span />
            <span />
            <span />
            <BarcodeScannerComponent onUpdate={handleBarcodeScanner} />
          </div>

          <button
            onClick={() => setIsShowBarcodeScanner(false)}
            style={btnStyle}
          >
            取消
          </button>
        </div>
      )} */}

      {isShowVideo && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div className='camera__box'>
            <Scanner
              onScan={handleVideo}
              formats={[
                'qr_code',
                'micro_qr_code',
                'rm_qr_code',
                'maxi_code',
                'pdf417',
                'aztec',
                'data_matrix',
                'matrix_codes',
                'dx_film_edge',
                'databar',
                'databar_expanded',
                'codabar',
                'code_39',
                'code_93',
                'code_128',
                'ean_8',
                'ean_13',
                'itf',
                'linear_codes',
                'upc_a',
                'upc_e',
              ]}
              onError={(error) => {
                console.log(`onError: ${error}'`);
              }}
              components={{
                audio: false,
                //   onOff: true,
                //   torch: true,
                //   zoom: true,
                //   finder: true,
                tracker: boundingBox,
              }}
              allowMultiple={true}
              scanDelay={300}
            />
          </div>

          {data && (
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <h2>掃描結果</h2>
              <p>{data}</p>
            </div>
          )}

          <button onClick={() => setIsShowVideo(false)} style={btnStyle}>
            取消
          </button>
        </div>
      )}
    </section>
  );
}

export default App;
