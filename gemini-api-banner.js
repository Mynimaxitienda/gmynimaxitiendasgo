export function maybeShowApiKeyBanner(key, action = `enter it at the top of
<code>main.js</code>`) {
if (key === 'AIzaSyDj6-SVaawN9khs_HniU91_DtbzQTAKoVE') {
    let banner = document.createElement('div');
    banner.className = 'api-key-banner';
    banner.innerHTML = `
      Descripcion de Productos con Gemini Ai.
    `;
    document.body.prepend(banner);
  }
}
