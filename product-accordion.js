(function() {
  'use strict';

  if (!location.pathname.includes('/productos/')) return;

  function init() {
    var productDetail = document.querySelector('.js-product-detail');
    if (!productDetail) return;

    var userContent = productDetail.querySelector('.user-content');
    if (!userContent) return;

    // Idempotente: si ya hay <details>, no re-procesar
    if (userContent.querySelector('details')) return;

    var html = userContent.innerHTML;
    if (!html || !html.trim()) return;

    var temp = document.createElement('div');
    temp.innerHTML = html;

    var FICHA_RE = /ficha\s*t[ée]cnica/i;
    var ENVIO_RE = /^env[íi]o/i;

    var sections = [{ title: 'Descripción', nodes: [] }];
    var current = sections[0];

    Array.prototype.forEach.call(temp.children, function(node) {
      var text = (node.textContent || '').trim();
      if (!text) return;

      // Detecta "Ficha Técnica:" como header de nueva sección
      if (FICHA_RE.test(text) && text.replace(/[:.\s]+$/, '').length < 30) {
        current = { title: 'Ficha Técnica', nodes: [] };
        sections.push(current);
        return;
      }

      // Detecta párrafo de envíos como sección propia
      if (ENVIO_RE.test(text)) {
        current = { title: 'Envíos', nodes: [node] };
        sections.push(current);
        return;
      }

      current.nodes.push(node);
    });

    var valid = sections.filter(function(s) { return s.nodes.length > 0; });
    if (valid.length === 0) return;

    var wrapper = document.createElement('div');
    wrapper.className = 'accordion-wrapper';

    valid.forEach(function(section, i) {
      var details = document.createElement('details');
      details.className = 'accordion-item';
      if (i === 0 && window.innerWidth >= 768) details.open = true;

      var summary = document.createElement('summary');
      summary.className = 'accordion-summary';
      summary.textContent = section.title;
      details.appendChild(summary);

      var body = document.createElement('div');
      body.className = 'accordion-body';
      section.nodes.forEach(function(n) { body.appendChild(n.cloneNode(true)); });
      details.appendChild(body);

      wrapper.appendChild(details);
    });

    userContent.innerHTML = '';
    userContent.appendChild(wrapper);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();