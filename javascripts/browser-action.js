const storageKey = [
  'dcl',
  'speed_index',
  'ttfb'
];

const textId = {
  dcl_lower: 'dcl_lower',
  dcl_upper: 'dcl_upper',
  speed_index_lower: 'speed_index_lower',
  speed_index_upper: 'speed_index_upper',
  ttfb_lower: 'ttfb_lower',
  ttfb_upper: 'ttfb_upper',
}

function setValue(id, value) {
  document.getElementById(id).value = value;
}
function getValue(id) {
  const value = document.getElementById(id).value;
  if (value === "") return null;
  return Number(value)
}

chrome.storage.sync.get(storageKey, function (data) {
  setValue(textId.dcl_lower, data.dcl.lowerValue);
  setValue(textId.dcl_upper, data.dcl.upperValue);
  setValue(textId.speed_index_lower, data.speed_index.lowerValue);
  setValue(textId.speed_index_upper, data.speed_index.upperValue);
  setValue(textId.ttfb_lower, data.ttfb.lowerValue);
  setValue(textId.ttfb_upper, data.ttfb.upperValue);
});


document.getElementById('saveConfig').addEventListener('click', (e)=> {

  const threshold = [
    {
      key:'dcl',
      upperValue: getValue(textId.dcl_upper) || 3000,
      lowerValue: getValue(textId.dcl_lower) || 1500
    },
    {
      key:'speed_index',
      upperValue: getValue(textId.speed_index_upper) || 4000,
      lowerValue: getValue(textId.speed_index_lower) || 1000
    },
    {
      key:'ttfb',
      upperValue: getValue(textId.ttfb_upper) || 1000,
      lowerValue: getValue(textId.ttfb_lower) || 500
    },
  ];
  const storage= threshold.reduce((prev, cur)=> {
    prev[cur.key] = cur;
    return prev;
  },{});

  chrome.storage.sync.set(storage, ()=> {
    chrome.tabs.getSelected(null, function(tab) {
      var code = 'window.location.reload();';
      chrome.tabs.executeScript(tab.id, {code: code});
      window.close();
    });
  });

});




