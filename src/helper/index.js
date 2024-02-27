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

const saveUtm = () => {
  const { search } = window.location;
  const queryString = parseQueryString(search);
  const {
    utm_source,
    utm_medium,
    utm_campaign,
    utm_term,
    utm_content,
    third_party,
    third_party_id,
    device_id,
  } = queryString;
  if (
    utm_source ||
    utm_medium ||
    utm_campaign ||
    utm_term ||
    utm_content ||
    third_party ||
    third_party_id ||
    device_id
  ) {
    const utm = {
      utm_source: utm_source ?? '',
      utm_medium: utm_medium ?? '',
      utm_campaign: utm_campaign ?? '',
      utm_term: utm_term ?? '',
      utm_content: utm_content ?? '',
      third_party: third_party ?? '',
      third_party_id: third_party_id ?? '',
      device_id: device_id ?? '',
    };
    setSessionStorage('utm', JSON.stringify(utm));
  }
};

const sendUtmToGtm = () => {
  const utmString = getSessionStorage('utm');
  const utm = JSON.parse(utmString);
  const {
    utm_source,
    utm_medium,
    utm_campaign,
    utm_term,
    utm_content,
    third_party,
    third_party_id,
    device_id,
  } = utm || {};
  sendDataToGtm({
    event: 'setUtmSource',
    key: 'utmSource',
    value: utm_source ?? '',
  });
  sendDataToGtm({
    event: 'setUtmMedium',
    key: 'utmMedium',
    value: utm_medium ?? '',
  });
  sendDataToGtm({
    event: 'setUtmCampaign',
    key: 'utmCampaign',
    value: utm_campaign ?? '',
  });
  sendDataToGtm({
    event: 'setUtmTerm',
    key: 'utmTerm',
    value: utm_term ?? '',
  });
  sendDataToGtm({
    event: 'setUtmContent',
    key: 'utmContent',
    value: utm_content ?? '',
  });
  sendDataToGtm({
    event: 'setThirdParty',
    key: 'thirdParty',
    value: third_party ?? '',
  });
  sendDataToGtm({
    event: 'setThirdPartyId',
    key: 'thirdPartyId',
    value: third_party_id ?? '',
  });
  sendDataToGtm({
    event: 'setDeviceId',
    key: 'deviceId',
    value: device_id ?? '',
  });
};

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
  saveUtm,
  sendUtmToGtm,
};
