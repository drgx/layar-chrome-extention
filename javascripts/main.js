(function () {
  const storageKey = [
    'dcl',
    'speed_index',
    'ttfb'
  ];
  const status = {
    pass: 'pass',
    warning: 'warning',
    failed: 'failed'
  };
  let logoColor;
  const classNames = {
    container: 'layarPerfContainer',
    hideContainer: 'layarContinerHide',
    title: 'layerTitle',
    item: 'layarChild',
    buttonContainer: 'layarButtonContainer',
    hideButton: 'layarHideButton',
    hide: 'layarHideActive',
    pass: 'layarGreenStat',
    warning: 'layarYellowStat',
    failed: 'layarRedStat'
  };


  const getLogoColor = function(listOfStat) {
    if (listOfStat.includes(status.failed)) return status.failed;
    else if (listOfStat.includes(status.warning)) return status.warning;
    return status.pass;
  }

  const showLayar = function (img, container) {
    img.className = `${classNames.hideButton} ${classNames.hide}`;
    container.className = `${classNames.container} ${classNames.hideContainer} ${classNames[window.logoColor]}`;
  };
  const hideLayar = function (img, container) {
    img.className = classNames.hideButton;
    container.className = `${classNames.container} ${classNames[window.logoColor]}`;
  };
  const getStatus = function (value, upper, lower) {
    if (value <= lower) return status.pass;
    else if (value >= lower && value <= upper) return status.warning;
    return status.failed;
  };

  const perf = window.performance.timing;
  const value = {
    dcl: perf.domContentLoadedEventStart - perf.domLoading,
    speedIndex: RUMSpeedIndex().toFixed(2),
    ttfb: perf.responseStart - perf.requestStart
  }


  new Promise((resolve, reject) => {
    let result = [];
    chrome.storage.sync.get(storageKey, function (data) {
      result = [
        {
          title: 'DOMContentLoaded',
          value: value.dcl,
          unit: 'ms',
          status: getStatus(value.dcl, data.dcl.upperValue, data.dcl.lowerValue)
        },
        {
          title: 'Speed Index',
          value: value.speedIndex,
          unit: 'ms',
          status: getStatus(value.speedIndex, data.speed_index.upperValue, data.speed_index.lowerValue)
        },
        {
          title: 'TTFB',
          value: value.ttfb,
          unit: 'ms',
          status: getStatus(value.ttfb, data.ttfb.upperValue, data.ttfb.lowerValue)
        },
      ];
      resolve(result)
    });

  }).then(result => {
    const container = document.createElement('div');

    result.forEach(data => {
      const item = document.createElement('div');
      const title = document.createElement('span');
      const value = document.createElement('span');
      title.className = classNames.title;
      item.className = classNames.item;
      title.innerText = `${data.title}: `;
      value.innerText = data.value + data.unit;
      value.className = classNames[data.status]
      item.appendChild(title);
      item.appendChild(value);
      container.appendChild(item);
    });
    const span = document.createElement('span');
    span.className = classNames.buttonContainer;
    const img = document.createElement('img');
    img.src = chrome.extension.getURL('/svg/arrow.svg');
    img.className = classNames.hideButton;
    span.appendChild(img);
    container.appendChild(span);
    let isActive = true;
    chrome.storage.sync.get('isActive', data => {
      isActive = !data.isActive;
      isActive ? showLayar(img, container) : hideLayar(img, container);
    });
    window.logoColor = getLogoColor(result.map(data=> data.status));

    container.className = `${classNames.container} ${classNames.hideContainer} ${classNames[window.logoColor]}`;
    chrome.storage.sync.set({icon: window.logoColor})
    span.addEventListener('click', e => {
      if (isActive) {
        isActive = false;
        showLayar(img, container);
      } else {
        isActive = true;
        hideLayar(img, container);
      }
      chrome.storage.sync.set({isActive}, null);
    });

    document.querySelector('body').appendChild(container);
  })

})();
