export function maybeShowApiKeyBanner(key, action = `enter it at the top of
<code>main.js</code>`) {
if (key === 'AIzaSyCikdo90Esq6FfstgAneMYfIlLpw0Xz5so') {
    let banner = document.createElement('div');
    banner.className = 'api-key-banner';
    banner.innerHTML = `
      Descripcion de Productos con Gemini Ai.
    `;
    document.body.prepend(banner);
  }
}
