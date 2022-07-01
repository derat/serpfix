// Copyright 2022 Daniel Erat.
// All rights reserved.

function getHost(url) {
  try {
    return new URL(url).hostname;
  } catch (err) {
    return '';
  }
}

(async () => {
  const prefs = await chrome.storage.sync.get(['hideAds', 'hideDomains']);

  const ads = document.getElementById('tads');
  if (ads && prefs.hideAds !== '0') {
    console.log('Hiding ads');
    ads.style.display = 'none';
  }

  const hideDomains = (prefs.hideDomains ?? '').split('\n').filter(Boolean);
  if (hideDomains.length) {
    for (const group of document.querySelectorAll('#search div.g')) {
      // Skip nested groups (used to show subpages).
      if (group.parentElement.closest('div.g')) continue;

      const href = group.querySelector('a')?.getAttribute('href');
      const host = getHost(href);
      if (!hideDomains.find((d) => host.includes(d))) continue;

      console.log(`Hiding ${href}`);
      const rep = document.createElement('div');
      rep.innerText = `${href} (hidden)`;
      rep.classList.add('serpfix-hidden-group');
      group.replaceWith(rep);
      rep.addEventListener('click', () => rep.replaceWith(group));
    }
  }
})();
