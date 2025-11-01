(function(){
  const params = new URLSearchParams(location.search);
  const raw = params.get('url');
  const input = raw ? raw : location.hostname || location.href;

  function extractSlug(inputVal){
    if (!inputVal) return '';
    let host = '';
    try{
      if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(inputVal)){
        host = new URL(inputVal).hostname;
      } else {
        host = inputVal.split('/')[0];
      }
    } catch(e){
      host = inputVal;
    }

    host = host.trim();
    const suffix = '.is-a.software';
    if (host.toLowerCase().endsWith(suffix)){
      return host.slice(0, -suffix.length).replace(/\.$/, '') || '';
    }

    const parts = host.split('.');
    if (parts.length > 1) return parts[0];
    return host;
  }

  const slug = extractSlug(input);
  const base = 'https://is-a.software/';
  const redirectUrl = slug ? base + '?d=' + encodeURIComponent(slug) : base;

  function init(){
    const urlText = document.getElementById('urlText');
    if (urlText) urlText.textContent = input;

    const signin = document.getElementById('signinBtn');
    if (signin) signin.href = redirectUrl;

    let sec = 5;
    const cnt = document.getElementById('count');
    const s = document.getElementById('s');
    if (cnt) cnt.textContent = sec;

    const tick = setInterval(() => {
      sec--;
      if (cnt) cnt.textContent = sec;
      if (s) s.textContent = sec === 1 ? '' : 's';
      if (sec <= 0) {
        clearInterval(tick);
        location.href = redirectUrl;
      }
    }, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
