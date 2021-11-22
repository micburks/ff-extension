(async function () {
  let backedupBody;
  const blockedHtml = `
    <h1>blocked</h1>
    <form id="override-form">
      <label for="override-text">Enter "I need <blocked-site>" to override</label>
      <input id="override-text" type="text" />
    </form>
  `;
  const blocks = (await browser.storage.local.get('brooser')).brooser || [];
  const isBlocked = blocks.some(b => window.location.origin.includes(b));
  if (isBlocked) {
    backedupBody = document.body.innerHTML;
    document.body.innerHTML = blockedHtml;
    document.getElementById("override-text").focus();
    document.getElementById('override-form').addEventListener('submit', e => {
      e.preventDefault();
      const val = document.getElementById('override-text').value;
      const site = val.trim().replace(/^i need /i, '');
      const origin = window.location.origin.replace(/^https?:\/\//, '').split('.').slice(0, -1);
      if (/^i need /i.test(val) && origin.some(o => o === site)) {
        document.body.innerHTML = backedupBody;
      }
    });
  }
})();
