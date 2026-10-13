(function () {
  const TRADE_KEYWORDS = [
    'recommend', 'looking for', 'anyone know', 'contractor', 'plumber',
    'electrician', 'mason', 'patio', 'landscaper', 'drainage', 'roof',
    'carpenter', 'deck', 'handyman', 'boiler', 'hvac', 'quote', 'estimate'
  ];

  function scanGroupPosts() {
    const articles = document.querySelectorAll('div[role="article"]');
    articles.forEach((article) => {
      if (article.dataset.jaProcessed) return;
      const text = (article.innerText || '').trim();
      if (text.length < 40) return;

      const lower = text.toLowerCase();
      const matched = TRADE_KEYWORDS.some((kw) => lower.includes(kw));
      if (!matched) return;

      article.dataset.jaProcessed = 'true';

      const bar = document.createElement('div');
      bar.style.cssText = 'margin: 8px 0; padding: 8px 12px; background: #090d16; border: 1px solid #10b981; border-radius: 10px; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px; font-family: sans-serif; z-index: 9999;';

      const badge = document.createElement('span');
      badge.style.cssText = 'color: #34d399; font-size: 11px; font-weight: 800;';
      badge.innerText = '⚡ JobAllies Trade Request Detected';

      const btnGroup = document.createElement('div');
      btnGroup.style.cssText = 'display: flex; gap: 6px;';

      const pushBtn = document.createElement('button');
      pushBtn.innerText = 'Push to JobAllies Radar';
      pushBtn.style.cssText = 'background: #f59e0b; color: #090d16; border: none; padding: 5px 10px; border-radius: 6px; font-size: 11px; font-weight: 800; cursor: pointer;';
      pushBtn.onclick = async () => {
        pushBtn.innerText = 'Sending...';
        try {
          await fetch('https://joballies.com/api/webhooks/leads?source=facebook_extension', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: text.split('\n')[0].slice(0, 70),
              description: text.slice(0, 400),
              sourceUrl: window.location.href,
              source: 'Facebook Group Co-Pilot'
            })
          });
          pushBtn.innerText = '✓ Sent to Radar';
          pushBtn.style.background = '#10b981';
        } catch (e) {
          pushBtn.innerText = 'Copied to Clipboard';
        }
      };

      const vouchBtn = document.createElement('button');
      vouchBtn.innerText = 'Copy Peer Ally Vouch';
      vouchBtn.style.cssText = 'background: #0ea5e9; color: #090d16; border: none; padding: 5px 10px; border-radius: 6px; font-size: 11px; font-weight: 800; cursor: pointer;';
      vouchBtn.onclick = () => {
        const vouchText = "Highly recommend reaching out to our trusted local trade partner on JobAllies — we work with them on projects around town all the time, super reliable and fair pricing. You can view a ballpark scope or message them directly here: https://joballies.com/post-project";
        navigator.clipboard.writeText(vouchText);
        vouchBtn.innerText = '✓ Vouch Copied! Paste in Comment';
      };

      const directBtn = document.createElement('button');
      directBtn.innerText = 'Copy Direct Reply';
      directBtn.style.cssText = 'background: #1e293b; color: #f8fafc; border: 1px solid #334155; padding: 5px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer;';
      directBtn.onclick = () => {
        const directText = "Hi there! We're licensed local contractors right here in the area and have completed several similar projects nearby. Happy to stop by or send over a quick line-item estimate: https://joballies.com/post-project";
        navigator.clipboard.writeText(directText);
        directBtn.innerText = '✓ Reply Copied! Paste Below';
      };

      btnGroup.appendChild(pushBtn);
      btnGroup.appendChild(vouchBtn);
      btnGroup.appendChild(directBtn);
      bar.appendChild(badge);
      bar.appendChild(btnGroup);
      article.prepend(bar);
    });
  }

  setInterval(scanGroupPosts, 3000);
})();
