function setInitialToggleState() {
  chrome.storage.sync.get('whatsappEnabled', (result) => {
    const whatsappEnabled = result.whatsappEnabled === undefined ? true : result.whatsappEnabled;
    document.getElementById('whatsapp').checked = whatsappEnabled;
  });
}

document.getElementById('whatsapp').addEventListener('change', (event) => {
  const isChecked = event.target.checked;
  chrome.storage.sync.set({ whatsappEnabled: isChecked });
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleChanged', whatsappEnabled: isChecked });
  });
});

document.addEventListener('DOMContentLoaded', setInitialToggleState);
