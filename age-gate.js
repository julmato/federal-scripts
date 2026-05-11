(function() {
  'use strict';
  
  var CONFIG = {
    storageKey: 'ageVerified',
    hours: 24,                    // 0 = una vez por sesión
    minAge: 18,
    brandName: 'Tu Vinoteca',
    redirectIfMinor: 'https://www.google.com',
    logoUrl: ''                   // opcional
  };
  
  // Inyectar estilos
  var css = `
    .ag-overlay{position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:999999;display:flex;align-items:center;justify-content:center;padding:20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif}
    .ag-modal{background:#fff;max-width:480px;width:100%;border-radius:12px;padding:40px 30px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.3)}
    .ag-logo{max-width:120px;margin:0 auto 20px;display:block}
    .ag-title{font-size:24px;font-weight:700;margin:0 0 12px;color:#1a1a1a}
    .ag-text{font-size:15px;line-height:1.5;color:#555;margin:0 0 28px}
    .ag-btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
    .ag-btn{padding:14px 28px;border:none;border-radius:8px;font-size:15px;font-weight:600;cursor:pointer;min-width:140px;transition:transform .1s,opacity .2s}
    .ag-btn:hover{transform:translateY(-1px)}
    .ag-btn-yes{background:#1a1a1a;color:#fff}
    .ag-btn-no{background:#f0f0f0;color:#555}
    .ag-legal{font-size:12px;color:#999;margin-top:20px}
    body.ag-locked{overflow:hidden}
  `;
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
  
  // Construir modal
  var overlay = document.createElement('div');
  overlay.className = 'ag-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.innerHTML = `
    <div class="ag-modal">
      ${CONFIG.logoUrl ? `<img src="${CONFIG.logoUrl}" alt="${CONFIG.brandName}" class="ag-logo">` : ''}
      <h2 class="ag-title">¿Sos mayor de ${CONFIG.minAge} años?</h2>
      <p class="ag-text">Para ingresar a ${CONFIG.brandName} necesitamos confirmar que sos mayor de edad. La venta de bebidas alcohólicas está prohibida a menores.</p>
      <div class="ag-btns">
        <button class="ag-btn ag-btn-yes" id="ag-yes">Sí, soy mayor</button>
        <button class="ag-btn ag-btn-no" id="ag-no">No</button>
      </div>
      <p class="ag-legal">Beber con moderación. Prohibida su venta a menores de ${CONFIG.minAge} años.</p>
    </div>
  `;
  
  function show() {
    document.body.appendChild(overlay);
    document.body.classList.add('ag-locked');
    
    document.getElementById('ag-yes').addEventListener('click', function() {
      try {
        if (CONFIG.hours === 0) {
          sessionStorage.setItem(CONFIG.storageKey, '1');
        } else {
          localStorage.setItem(CONFIG.storageKey, Date.now().toString());
        }
      } catch(e) {}
      overlay.remove();
      document.body.classList.remove('ag-locked');
    });
    
    document.getElementById('ag-no').addEventListener('click', function() {
      window.location.href = CONFIG.redirectIfMinor;
    });
  }
  
  if (document.body) {
    show();
  } else {
    document.addEventListener('DOMContentLoaded', show);
  }
})();
