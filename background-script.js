let blocks = [];

/*
browser.runtime.onInstalled.addListener(details => {
  browser.storage.local.set({
    brooser: []
  });
});
*/

browser.storage.local.get(data => {
  blocks = data.brooser || [];
});

browser.storage.local.get(data => {
  blocks = data.brooser || [];
});

browser.storage.onChanged.addListener(changed => {
  blocks = changed.brooser.newValue;
});

browser.webRequest.onBeforeRequest.addListener(listener, {
  urls: ['<all_urls>'],
  types: ['main_frame'],
},
  ['blocking']
);

async function listener(req) {
  const url = new URL(req.url);
  const [block, ts] = blocks.find(([block]) => block === url.hostname) || [];
  if (block && (ts ? ts < now() : true)) {
    return {
      redirectUrl: `${browser.runtime.getURL('pages/blocked.html')}?${encodeURIComponent(url.href)}`,
    };
  } else {
    return {
      type: 'direct',
    };
  }
}

function now() {
  return +(new Date());
}
