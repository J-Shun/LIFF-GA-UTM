/* localstorage 獲得、設定、移除 */
function getLocalStorage(name) {
  return localStorage.getItem(name);
}
function setLocalStorage(name, value) {
  localStorage.setItem(name, value);
}
function clearLocalStorage(name) {
  localStorage.removeItem(name);
}
function clearAllLocalStorage() {
  localStorage.clear();
}

/* sessionstorage 獲得、設定、移除 */
function getSessionStorage(name) {
  return sessionStorage.getItem(name);
}
function setSessionStorage(name, value) {
  sessionStorage.setItem(name, value);
}
function clearSessionStorage(name) {
  sessionStorage.removeItem(name);
}
function clearAllSessionStorage() {
  sessionStorage.clear();
}

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

function parseQueryString(queryString) {
  const params = new URLSearchParams(queryString);
  const obj = {};
  for (const [key, value] of params) {
    obj[key] = value;
  }
  return obj;
}

export {
  getLocalStorage,
  setLocalStorage,
  clearLocalStorage,
  clearAllLocalStorage,
  getSessionStorage,
  setSessionStorage,
  clearSessionStorage,
  clearAllSessionStorage,
  sendDataToGtm,
  parseQueryString,
};
