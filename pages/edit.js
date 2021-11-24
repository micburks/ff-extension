let blocks = [];

browser.storage.local.get(data => {
  blocks = data.brooser || [];
  setBlocks();
});

browser.storage.onChanged.addListener(changed => {
  blocks = changed.brooser.newValue;
  setBlocks();
});

const redirectUrl = new URL(decodeURIComponent(window.location.search.slice(1)));

function setBlocks() {
  console.log(blocks);
  if (blocks.length) {
    const blockHTML = blocks.sort().map(([block]) => `
      <li id="${block}">${block} <button id="${block}-remove" class="remove">&nbsp;X&nbsp;</button></li>
      `).join('');
    document.getElementById('block-list').innerHTML = blockHTML;
  }
  const removables = document.getElementsByClassName('remove') || [];
  Array.from(removables).forEach(el =>
    el.addEventListener('click', async e => {
      const val = e.target.parentElement.id;
      blocks = blocks.filter(([block]) => block !== val);
      await browser.storage.local.set({brooser: blocks});
    })
  );
}

document.getElementById('exit').addEventListener('click', e => {
  window.location.href = redirectUrl;
});
