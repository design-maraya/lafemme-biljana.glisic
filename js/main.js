// La Femme, Biljana Glišić: interakcije
(function () {
  var mqPhone = window.matchMedia('(max-width: 760px)');
  var isTouch = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || '');

  // izbor jezika (za sada samo oznaka, prevod dolazi kasnije)
  var langBtns = document.querySelectorAll('[data-lang]');
  langBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      langBtns.forEach(function (b) {
        var on = b === btn;
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
        b.style.background = on ? '#FDD406' : 'rgba(255, 255, 255, 0.14)';
        b.style.color = on ? '#1F3834' : '#FFFFFF';
      });
    });
  });

  // mobilni meni
  var menuBtn = document.getElementById('menu-btn');
  var mobNav = document.getElementById('mob-nav');
  if (menuBtn && mobNav) {
    menuBtn.addEventListener('click', function () {
      var open = mobNav.hasAttribute('hidden');
      if (open) mobNav.removeAttribute('hidden'); else mobNav.setAttribute('hidden', '');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuBtn.setAttribute('aria-label', open ? 'Zatvori meni' : 'Otvori meni');
    });
    mobNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mobNav.setAttribute('hidden', '');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.setAttribute('aria-label', 'Otvori meni');
      });
    });
  }

  // meni se na telefonu sakrije pri skrolovanju nadolje, a pojavi pri skrolovanju nagore
  var header = document.getElementById('site-header');
  var lastY = window.scrollY;
  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    if (!mqPhone.matches || (mobNav && !mobNav.hasAttribute('hidden'))) { header.classList.remove('is-hidden'); lastY = y; return; }
    if (y > lastY + 6 && y > 120) header.classList.add('is-hidden');
    else if (y < lastY - 6) header.classList.remove('is-hidden');
    lastY = y;
  }, { passive: true });

  // stavke "Zvuči li ti poznato?" se pojavljuju jedna za drugom pri svakom ulasku u sekciju
  var pains = document.getElementById('pains');
  if (pains && 'IntersectionObserver' in window) {
    pains.classList.add('lf-wait');
    new IntersectionObserver(function (entries) {
      var e = entries[entries.length - 1];
      if (e.isIntersecting) { pains.classList.remove('lf-wait'); pains.classList.add('lf-go'); }
      else if (e.intersectionRatio === 0) { pains.classList.remove('lf-go'); pains.classList.add('lf-wait'); }
    }, { threshold: [0, 0.2] }).observe(pains);
  }

  // česta pitanja
  var faqBtns = document.querySelectorAll('[data-faq]');
  function setFaq(btn, open) {
    var ans = document.getElementById('faq-a-' + btn.getAttribute('data-faq'));
    var sign = btn.querySelector('.faq-sign');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (ans) { if (open) ans.removeAttribute('hidden'); else ans.setAttribute('hidden', ''); }
    if (sign) {
      sign.textContent = open ? '−' : '+';
      sign.style.background = open ? '#1F3834' : 'transparent';
      sign.style.color = open ? '#FDD406' : '#1F3834';
      sign.style.border = open ? '0' : '1px solid #DDE2DE';
    }
  }
  faqBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var wasOpen = btn.getAttribute('aria-expanded') === 'true';
      faqBtns.forEach(function (b) { setFaq(b, false); });
      if (!wasOpen) setFaq(btn, true);
    });
  });

  // Viber: na računaru bez Vibera klik ne radi ništa, pa prikažemo broj telefona
  var viberTimer;
  document.querySelectorAll('[data-viber]').forEach(function (a) {
    a.addEventListener('click', function () {
      if (isTouch) return;
      var hint = document.getElementById('viber-hint-' + a.getAttribute('data-viber'));
      if (!hint) return;
      clearTimeout(viberTimer);
      document.querySelectorAll('[id^="viber-hint-"]').forEach(function (h) { h.setAttribute('hidden', ''); });
      viberTimer = setTimeout(function () {
        hint.removeAttribute('hidden');
        viberTimer = setTimeout(function () { hint.setAttribute('hidden', ''); }, 8000);
      }, 1200);
    });
  });
})();
