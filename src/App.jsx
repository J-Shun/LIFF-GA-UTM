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

function centerText(detectedCodes, ctx) {
  detectedCodes.forEach((detectedCode) => {
    const { boundingBox, rawValue } = detectedCode;
    const centerX = boundingBox.x + boundingBox.width / 2;
    const centerY = boundingBox.y + boundingBox.height / 2;
    const fontSize = Math.max(12, (50 * boundingBox.width) / ctx.canvas.width);
    const lineHeight = fontSize;

    ctx.font = `${fontSize}px sans-serif`;
    ctx.textAlign = 'left';

    let formattedText;
    try {
      formattedText = JSON.stringify(JSON.parse(rawValue), null, 2);
    } catch {
      formattedText = rawValue;
    }

    const lines = formattedText.split('\n');
    const textWidth = Math.max(
      ...lines.map((line) => ctx.measureText(line).width)
    );
    const textHeight = lines.length * lineHeight;
    const padding = 10;
    const rectX = centerX - textWidth / 2 - padding;
    const rectY = centerY - textHeight / 2 - padding;
    const rectWidth = textWidth + padding * 2;
    const rectHeight = textHeight + padding;
    const radius = 8;

    ctx.beginPath();
    ctx.moveTo(rectX + radius, rectY);
    ctx.lineTo(rectX + rectWidth - radius, rectY);
    ctx.quadraticCurveTo(
      rectX + rectWidth,
      rectY,
      rectX + rectWidth,
      rectY + radius
    );
    ctx.lineTo(rectX + rectWidth, rectY + rectHeight - radius);
    ctx.quadraticCurveTo(
      rectX + rectWidth,
      rectY + rectHeight,
      rectX + rectWidth - radius,
      rectY + rectHeight
    );
    ctx.lineTo(rectX + radius, rectY + rectHeight);
    ctx.quadraticCurveTo(
      rectX,
      rectY + rectHeight,
      rectX,
      rectY + rectHeight - radius
    );
    ctx.lineTo(rectX, rectY + radius);
    ctx.quadraticCurveTo(rectX, rectY, rectX + radius, rectY);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 255, 0, 0.9)';
    ctx.fill();

    lines.forEach((line, index) => {
      const y =
        centerY + index * lineHeight - ((lines.length - 1) * lineHeight) / 2;
      let currentX = centerX - textWidth / 2;
      let lastIndex = 0;

      const propertyMatches = [...line.matchAll(/"([^"]+)":/g)];
      const valueMatches = [
        ...line.matchAll(/:\s*("[^"]*"|\d+|true|false|null)/g),
      ];

      propertyMatches.forEach((match, matchIndex) => {
        const property = match[0].replace(':', '');
        const beforeProperty = line.substring(lastIndex, match.index);

        ctx.fillStyle = 'black';
        ctx.fillText(beforeProperty, currentX, y);
        currentX += ctx.measureText(beforeProperty).width;

        ctx.fillStyle = 'blue';
        ctx.fillText(property, currentX, y);
        currentX += ctx.measureText(property).width;

        lastIndex = match.index + property.length;

        ctx.fillStyle = 'black';
        ctx.fillText(': ', currentX, y);
        currentX += ctx.measureText(': ').width;

        if (matchIndex < valueMatches.length) {
          const valueMatch = valueMatches[matchIndex];
          const beforeValue = line.substring(lastIndex, valueMatch.index);

          ctx.fillStyle = 'black';
          ctx.fillText(beforeValue, currentX, y);
          currentX += ctx.measureText(beforeValue).width;

          const value = valueMatch[0].match(/:\s*(.*)/)?.[1] ?? '';
          ctx.fillStyle = 'green';
          ctx.fillText(value, currentX, y);
          currentX += ctx.measureText(value).width;

          lastIndex = valueMatch.index + valueMatch[0].length;
        }
      });

      ctx.fillStyle = 'black';
      const remainingLine = line.substring(lastIndex);
      ctx.fillText(remainingLine, currentX, y);
    });
  });
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

  const handleBarcodeScanner = (err, result) => {
    if (result) {
      console.log(result);
      setData(result);
      setIsShowBarcodeScanner(false);
    }
  };

  const handleVideo = (result) => {
    console.log(result);
    if (!result) return;

    const invoiceRegex = /^[A-Z]{2}\d{8}.*$/;
    const isInvoice = invoiceRegex.test(result[0].rawValue);

    if (!isInvoice) return;

    setData(result[0].rawValue);
    setIsShowVideo(false);
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
          <button onClick={handleCodeV2} style={btnStyle}>
            scanCodeV2
          </button>

          <button
            onClick={() => setIsShowBarcodeScanner(true)}
            style={btnStyle}
          >
            BarcodeScanner
          </button>

          <button onClick={() => setIsShowVideo(true)} style={btnStyle}>
            自製
          </button>
        </div>
      )}

      {isShowBarcodeScanner && (
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
      )}

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
                audio: true,
                onOff: true,
                torch: true,
                zoom: true,
                finder: true,
                tracker: centerText,
              }}
              allowMultiple={true}
              scanDelay={2000}
            />
          </div>

          <button onClick={() => setIsShowVideo(false)} style={btnStyle}>
            取消
          </button>
        </div>
      )}

      {data && (
        <div>
          <h2>掃描結果</h2>
          <p>{data}</p>
        </div>
      )}
    </section>
  );
}

export default App;
