window.dataLayer = window.dataLayer || [];

window.gtag = function gtag() {
  window.dataLayer.push(arguments);
};

if (location.hostname === 'shikaku.antonbase.com') {
  window.gtag('js', new Date());
  window.gtag('config', 'G-PTXZKSKY58');

  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-PTXZKSKY58';
  document.head.appendChild(script);
}
