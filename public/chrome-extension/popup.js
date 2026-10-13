document.addEventListener('DOMContentLoaded', () => {
  chrome.storage?.local.get(['companyName', 'allyName', 'serviceArea'], (res) => {
    if (res.companyName) document.getElementById('companyName').value = res.companyName;
    if (res.allyName) document.getElementById('allyName').value = res.allyName;
    if (res.serviceArea) document.getElementById('serviceArea').value = res.serviceArea;
  });

  document.getElementById('saveBtn').addEventListener('click', () => {
    const companyName = document.getElementById('companyName').value;
    const allyName = document.getElementById('allyName').value;
    const serviceArea = document.getElementById('serviceArea').value;
    chrome.storage?.local.set({ companyName, allyName, serviceArea }, () => {
      document.getElementById('statusMsg').innerText = 'Settings saved! Refresh your Facebook Group tab.';
    });
  });
});
