let blocks = [];

browser.storage.local.get(data => {
  blocks = data.brooser || [];
  setBlocks();
});

browser.storage.onChanged.addListener(changed => {
  blocks = changed.brooser.newValue;
  setBlocks();
});

document.getElementById('block-this').addEventListener('click', async e => {
  const [tab] = await browser.tabs.query({active: true, currentWindow: true});
  const {hostname, protocol} = new URL(tab.url);
  if (protocol === 'moz-extension:') {
    return;
  }
  if (blocks.some(([block]) => block === hostname)) {
    return;
  }
  blocks.push([hostname, now()]);
  await browser.storage.local.set({brooser: blocks});
  await browser.tabs.reload(tab.id);
});

function now() {
  const d = new Date();
  return +d;
}

document.getElementById('edit').addEventListener('click', async e => {
  const [tab] = await browser.tabs.query({active: true, currentWindow: true});
  const blockedUrl = browser.runtime.getURL('pages/blocked.html');
  if (tab.url.startsWith(blockedUrl)) {
    return;
  }
  browser.tabs.update(tab.id, {
    url: `${browser.runtime.getURL('pages/edit.html')}?${encodeURIComponent(tab.url)}`,
  });
});

function setBlocks() {
  document.getElementById('blocks').innerHTML = blocks.sort().map(([block]) => `<li>${block}</li>`).join('');
}
