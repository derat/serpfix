// Copyright 2022 Daniel Erat.
// All rights reserved.

const $ = (id) => document.getElementById(id);

async function savePrefs() {
  const hideAds = $('hide-ads-checkbox').checked ? '1' : '0';
  const textarea = $('hide-domains-textarea');
  const hideDomains = textarea.value
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
    .sort()
    .join('\n');

  await chrome.storage.sync.set({ hideAds, hideDomains });
  textarea.value = hideDomains;
}

document.addEventListener('DOMContentLoaded', async () => {
  const prefs = await chrome.storage.sync.get(['hideAds', 'hideDomains']);
  $('hide-ads-checkbox').checked = prefs.hideAds !== '0';
  $('hide-domains-textarea').value = prefs.hideDomains ?? '';

  const saveButton = $('save-button');
  saveButton.addEventListener('click', savePrefs);
  saveButton.disabled = false;
});
