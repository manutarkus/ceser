(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Barra de progreso de lectura */
  if (!reduce) {
    var bar = document.createElement('div');
    bar.className = 'fx-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    var ticking = false;
    var update = function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var p = h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0;
      bar.style.transform = 'scaleX(' + p + ')';
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* Aparición al hacer scroll de las secciones que quedan bajo el pliegue */
  if (reduce || !('IntersectionObserver' in window)) return;

  var targets = Array.prototype.filter.call(document.querySelectorAll('.e-parent'), function (el) {
    if (el.closest('header, .elementor-location-header')) return false;
    var r = el.getBoundingClientRect();
    if (r.height === 0) return false;
    return r.top > window.innerHeight * 0.9;
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('fx-in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });

  targets.forEach(function (el) {
    el.classList.add('fx-reveal');
    io.observe(el);
  });

  /* Seguridad: si algo impide el observador, no dejar contenido oculto */
  setTimeout(function () {
    targets.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (!el.classList.contains('fx-in') && r.top < window.innerHeight && r.bottom > 0) {
        el.classList.add('fx-in');
      }
    });
  }, 2500);
})();
