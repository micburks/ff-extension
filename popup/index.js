function listenForEvents() {
}

function reportExecuteScriptError(error) {
  document.querySelector("#popup-content").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");
  console.error(`Failed to execute brooser content script: ${error.message}`);
}

(async function () {
  async function setBlocks() {
    const blocks = (await browser.storage.local.get('brooser')).brooser || [];
    document.getElementById('blocks').innerHTML = blocks.map(b => `<li>${b}</li>`);
  }
  await setBlocks();

  document.getElementById('edit').addEventListener('click', e => {
    browser.tabs.executeScript({file: "/content-scripts/edit.js"})
      .then(listenForEvents)
      .catch(reportExecuteScriptError);
  });

  document.getElementById('block-this').addEventListener('click', async e => {
    const blocks = (await browser.storage.local.get('brooser')).brooser || [];
    const tab = (await browser.tabs.query({active: true, currentWindow: true}))[0];
    const origin = (new URL(tab.url)).origin;
    const newBlocks = Array.from(
      new Set(
        blocks.concat(origin.replace(/^https?:\/\//, ''))
      )
    );
    await browser.storage.local.set({brooser: newBlocks});
    await browser.tabs.reload(tab.id);
  });
})();
