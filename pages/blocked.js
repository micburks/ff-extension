let blocks = [];

browser.storage.local.get(data => {
  blocks = data.brooser || [];
});

browser.storage.onChanged.addListener(changed => {
  blocks = changed.brooser.newValue;
});

const redirectUrl = new URL(decodeURIComponent(window.location.search.slice(1)));
const redirectHost = redirectUrl.hostname.split('.').slice(-2, -1)[0];

document.getElementById("override-text").focus();
document.getElementById('override-text-label').innerText = `Enter "I NEED ${redirectHost}" to override`;
document.getElementById('override-form').addEventListener('submit', async e => {
  e.preventDefault();
  const val = document.getElementById('override-text').value;
  const site = val.trim().replace(/^i need /i, '');
  const host = redirectUrl.hostname.split('.').slice(0, -1);
  if (/^i need /i.test(val) && host.some(o => o === site)) {
    let brooser = blocks.map(b => {
      let [block, ts] = b;
      if (block === redirectUrl.hostname) {
        return [block, getSnoozeTime()];
      } else {
        return b;
      }
    });
    await browser.storage.local.set({brooser});
    window.location.href = redirectUrl;
  }
});

function getSnoozeTime() {
  let d = +(new Date());
  d += (1 * 60 * 1000); // 1 minute
  return d;
}
