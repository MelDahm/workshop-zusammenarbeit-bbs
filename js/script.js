/* ==========================================================================
   Zusammenarbeit gemeinsam wirksam gestalten
   Vanilla JavaScript, keine Abhängigkeiten.
   ========================================================================== */

(function () {
  'use strict';

  var reduzierteBewegung = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  /* ------------------------------------------------------------------
     Mobile Navigation
     ------------------------------------------------------------------ */

  var navToggle = document.querySelector('.nav-toggle');
  var siteNav = document.getElementById('hauptnavigation');

  function navSchliessen() {
    if (!siteNav || !navToggle) return;
    siteNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  /* Die Höhe des Kopfbereichs ist je nach Bildschirmbreite unterschiedlich.
     Der Wert wird gemessen, damit Anker und Sprünge nie unter der
     Navigation verschwinden. */

  var kopf = document.querySelector('.site-header');

  function kopfHoeheSetzen() {
    if (!kopf) return;
    var hoehe = Math.ceil(kopf.getBoundingClientRect().height);
    document.documentElement.style.setProperty('--kopf-hoehe', hoehe + 'px');
  }

  kopfHoeheSetzen();

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function () {
      var offen = siteNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', offen ? 'true' : 'false');
    });

    siteNav.addEventListener('click', function (ereignis) {
      if (ereignis.target.closest('a')) navSchliessen();
    });

    document.addEventListener('keydown', function (ereignis) {
      if (ereignis.key === 'Escape' && siteNav.classList.contains('is-open')) {
        navSchliessen();
        navToggle.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 768) navSchliessen();
      kopfHoeheSetzen();
    });
  }

  /* ------------------------------------------------------------------
     Aktiver Navigationsabschnitt
     ------------------------------------------------------------------ */

  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll('.site-nav__list a[href^="#"]')
  );

  var abschnitte = navLinks
    .map(function (link) {
      var id = link.getAttribute('href').slice(1);
      var ziel = document.getElementById(id);
      return ziel ? { link: link, ziel: ziel } : null;
    })
    .filter(Boolean);

  function aktuellenAbschnittSetzen(id) {
    navLinks.forEach(function (link) {
      if (link.getAttribute('href') === '#' + id) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  if (abschnitte.length && 'IntersectionObserver' in window) {
    var sichtbare = new Map();

    var beobachter = new IntersectionObserver(
      function (eintraege) {
        eintraege.forEach(function (eintrag) {
          if (eintrag.isIntersecting) {
            sichtbare.set(eintrag.target.id, eintrag.boundingClientRect.top);
          } else {
            sichtbare.delete(eintrag.target.id);
          }
        });

        if (!sichtbare.size) return;

        var oberster = Array.from(sichtbare.entries()).sort(function (a, b) {
          return a[1] - b[1];
        })[0];

        aktuellenAbschnittSetzen(oberster[0]);
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );

    abschnitte.forEach(function (eintrag) {
      beobachter.observe(eintrag.ziel);
    });
  }

  /* ------------------------------------------------------------------
     Dokumentationsblöcke: Zustand merken
     ------------------------------------------------------------------ */

  var dokuBloecke = Array.prototype.slice.call(document.querySelectorAll('.doku-block'));
  var speicherSchluessel = 'doku-offen-ob-bbs';

  function offeneBloeckeLesen() {
    try {
      return JSON.parse(window.localStorage.getItem(speicherSchluessel) || '[]');
    } catch (fehler) {
      return [];
    }
  }

  function offeneBloeckeSpeichern() {
    try {
      var offen = dokuBloecke
        .filter(function (block) { return block.open; })
        .map(function (block) { return block.id; });
      window.localStorage.setItem(speicherSchluessel, JSON.stringify(offen));
    } catch (fehler) {
      /* localStorage nicht verfügbar, Zustand bleibt erhalten */
    }
  }

  dokuBloecke.forEach(function (block) {
    block.addEventListener('toggle', offeneBloeckeSpeichern);
  });

  // Zustand wiederherstellen, außer die Person springt direkt über einen Ankerlink
  // in einen geschlossenen Block.
  var sprungZiel = window.location.hash ? document.querySelector(window.location.hash) : null;

  if (sprungZiel && sprungZiel.classList.contains('doku-block')) {
    sprungZiel.open = true;
  } else {
    offeneBloeckeLesen().forEach(function (id) {
      var block = document.getElementById(id);
      if (block && block.classList.contains('doku-block')) block.open = true;
    });
  }

  /* Beim Direktaufruf mit Anker springt der Browser, bevor Kopfhöhe und
     Bilder vollständig bekannt sind. Nachladende Bilder (loading="lazy")
     verändern die Seitenhöhe, deshalb wird mehrfach nachgerichtet,
     bis die Höhe stabil bleibt. */

  function ausrichtenNachLaden() {
    var ziel = document.querySelector(window.location.hash);
    if (!ziel) return;

    kopfHoeheSetzen();
    springen(ziel, 'auto');

    // Nachladende Bilder (loading="lazy") verändern die Seitenhöhe,
    // deshalb wird nachgerichtet, bis die Höhe stabil bleibt.
    var versuche = 0;
    var letzteHoehe = 0;
    var pruefen = function () {
      var hoehe = document.documentElement.scrollHeight;
      versuche += 1;
      if (versuche > 12 || (hoehe === letzteHoehe && versuche > 1)) return;
      letzteHoehe = hoehe;
      springen(ziel, 'auto');
      window.setTimeout(pruefen, 250);
    };
    window.setTimeout(pruefen, 250);
  }

  if (window.location.hash) {
    window.addEventListener('load', ausrichtenNachLaden);
    window.addEventListener('hashchange', function () {
      window.setTimeout(ausrichtenNachLaden, 0);
    });
  }

  /* ------------------------------------------------------------------
     Lightbox für Workshopfotos
     ------------------------------------------------------------------ */

  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var lightboxCaption = document.getElementById('lightbox-caption');
  var letzterFokus = null;

  function lightboxOeffnen(bildquelle, bildtext, bildbeschreibung) {
    if (!lightbox) return;
    letzterFokus = document.activeElement;
    lightboxImg.src = bildquelle;
    lightboxImg.alt = bildtext || '';
    lightboxCaption.textContent = bildbeschreibung || '';
    lightbox.hidden = false;
    document.body.classList.add('lightbox-off');
    var schliessen = lightbox.querySelector('.lightbox__close');
    if (schliessen) schliessen.focus();
  }

  function lightboxSchliessen() {
    if (!lightbox || lightbox.hidden) return;
    lightbox.hidden = true;
    lightboxImg.src = '';
    lightboxImg.alt = '';
    lightboxCaption.textContent = '';
    document.body.classList.remove('lightbox-off');
    if (letzterFokus && typeof letzterFokus.focus === 'function') {
      letzterFokus.focus();
    }
  }

  /* Innerhalb der Lightbox bleibt der Fokus, bis sie geschlossen wird. */

  if (lightbox) {
    lightbox.addEventListener('keydown', function (ereignis) {
      if (ereignis.key !== 'Tab') return;
      var schliessen = lightbox.querySelector('.lightbox__close');
      if (!schliessen) return;
      ereignis.preventDefault();
      schliessen.focus();
    });
  }

  document.querySelectorAll('.foto__link').forEach(function (link) {
    link.setAttribute('aria-haspopup', 'dialog');
    link.setAttribute('aria-label', 'Foto vergrößert ansehen: ' + (link.getAttribute('data-caption') || 'Workshopfoto'));
    link.addEventListener('click', function (ereignis) {
      ereignis.preventDefault();
      var bild = link.querySelector('img');
      var figcaption = link.closest('figure') ? link.closest('figure').querySelector('figcaption') : null;
      lightboxOeffnen(
        link.getAttribute('href'),
        bild ? bild.alt : '',
        (link.getAttribute('data-caption') || (figcaption ? figcaption.textContent.trim() : ''))
      );
    });
  });

  if (lightbox) {
    lightbox.addEventListener('click', function (ereignis) {
      if (ereignis.target.hasAttribute('data-lightbox-close')) lightboxSchliessen();
    });
    document.addEventListener('keydown', function (ereignis) {
      if (ereignis.key === 'Escape') lightboxSchliessen();
    });
  }

  /* ------------------------------------------------------------------
     Nach oben
     ------------------------------------------------------------------ */

  var nachOben = document.getElementById('back-to-top');

  if (nachOben) {
    function nachObenSichtbarkeit() {
      nachOben.hidden = window.scrollY < 1200;
    }

    window.addEventListener('scroll', nachObenSichtbarkeit, { passive: true });
    nachOben.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: reduzierteBewegung ? 'auto' : 'smooth'
      });
      var sprungZielStart = document.getElementById('start');
      if (sprungZielStart) sprungZielStart.focus({ preventScroll: true });
    });
    nachObenSichtbarkeit();
  }

  /* ------------------------------------------------------------------
     Sprung zu Ankern
     Geschlossene Dokumentationsblöcke werden vor dem Sprung geöffnet.
     Nach dem Schließen des mobilen Menüs wird gescrollt, damit die
     Zielposition zur geaenderten Seitenhoehe passt.
     ------------------------------------------------------------------ */

  function berechnen(funktion) {
    if ('requestAnimationFrame' in window) {
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(funktion);
      });
    } else {
      window.setTimeout(funktion, 0);
    }
  }

  function springen(ziel, verhalten) {
    if (typeof ziel.focus === 'function') {
      if (!ziel.hasAttribute('tabindex')) ziel.setAttribute('tabindex', '-1');
      ziel.focus({ preventScroll: true });
    }
    // 'instant' überschreibt die CSS-Vorgabe scroll-behavior: smooth.
    if (typeof ziel.scrollIntoView === 'function') {
      ziel.scrollIntoView({ behavior: verhalten === 'auto' ? 'instant' : verhalten, block: 'start' });
    } else {
      window.scrollTo(0, ziel.offsetTop);
    }
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (ereignis) {
      var id = link.getAttribute('href');
      if (!id || id === '#') return;

      var ziel = document.getElementById(id.slice(1));
      if (!ziel) return;

      var navWarOffen = Boolean(siteNav && siteNav.classList.contains('is-open'));
      var blockOeffnen = ziel.classList.contains('doku-block') && !ziel.open;

      // Standardverhalten genügt, wenn nichts anzupassen ist.
      if (!navWarOffen && !blockOeffnen && !reduzierteBewegung) return;

      ereignis.preventDefault();

      if (blockOeffnen) ziel.open = true;
      if (navWarOffen) navSchliessen();
      kopfHoeheSetzen();

      var verhalten = reduzierteBewegung ? 'auto' : 'smooth';
      berechnen(function () {
        springen(ziel, verhalten);
        if (window.history && window.history.pushState) {
          window.history.pushState(null, '', id);
        }
      });
    });
  });
})();
