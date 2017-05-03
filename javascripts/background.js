
const threshold = [
  {
    key:'speed_index',
    upperValue: 4000,
    lowerValue: 1000
  },
  {
    key:'dcl',
    upperValue: 3000,
    lowerValue: 1500
  },
  {
    key:'ttfb',
    upperValue: 1000,
    lowerValue: 500
  },
];

const allKey = threshold.map(data => {
  return data.key;
});

new Promise((resolve, reject) => {
  chrome.storage.sync.get(allKey, data => {
    console.log(data);
    resolve(data);
  });
}).then(data => {
  if (Object.keys(data).length === 0) {
    const defaultConfig = threshold.reduce((prev, cur)=> {
     prev[cur.key] = cur;
      return prev;
    },{});
    chrome.storage.sync.set(defaultConfig, null);
  }
});
const iconPath = {
  pass: 'icon/layar-green.png',
  failed: 'icon/layar-red.png',
  warning: 'icon/layar-yellow.png'
}

chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (let key in changes) {
    var storageChange = changes[key];
    if (key === 'icon') {
      const value = storageChange.newValue;
      chrome.browserAction.setIcon({path: iconPath[value]});
    }
  }
});