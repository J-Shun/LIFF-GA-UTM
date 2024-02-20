/**
 * 將特殊資料傳送到 GTM dataLayer
 * @param {Object} options
 * @param {string} options.event - Google Tag Manager 中的事件名稱。
 * @param {string} options.key - 資料的鍵（Key）。
 * @param {string} options.value - 資料的值。
 */
function sendDataToGtm({ event, key, value }) {
  window.dataLayer.push({
    event,
    [key]: value,
  });
}

export { sendDataToGtm };
