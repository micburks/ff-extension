let backedupBody;

async function loadBlocks() {
  const blocks = (await browser.storage.local.get('brooser')).brooser || [];
  const editHtml = `
      <h1>blocks</h1>
      <div id="exit">exit</div>
      <ul>
      ${!blocks.length ? '' : blocks.map(b => `
        <li id="${b}">${b} <span id="${b}-remove" class="remove">X</span></li>
      `)}
      </ul>
  `;
  if (!backedupBody) {
    backedupBody = document.body.innerHTML;
  }
  document.body.innerHTML = editHtml;
  const removables = document.getElementsByClassName('remove') || [];
  Array.from(removables).forEach(el =>
    el.addEventListener('click', async e => {
      const val = e.target.parentElement.id;
      const set = new Set(blocks);
      set.delete(val);
      await browser.storage.local.set({brooser: Array.from(set)});
      await loadBlocks();
    })
  );

  document.getElementById('exit').addEventListener('click', e => {
    document.body.innerHTML = backedupBody;
  });
}

loadBlocks();
