/* ============================================================
   PLASTIFLEX S.A. — main.js · v2
   Motor de animaciones GSAP + ScrollTrigger con fallback total:
   si GSAP no carga o el usuario prefiere menos movimiento,
   el sitio funciona y se ve completo igual.
   ------------------------------------------------------------
   Módulos:
   01 · Preloader con contador
   02 · Barra de progreso de scroll
   03 · Header inteligente (oculta al bajar, aparece al subir)
   04 · Menú móvil + dropdown Productos
   05 · Split text del hero (animación palabra por palabra)
   06 · Reveals con ScrollTrigger (stagger por sección)
   07 · Parallax en imágenes [data-parallax]
   08 · Contadores animados [data-count]
   09 · Botones magnéticos [data-magnetic]
   10 · Tilt 3D en cards de producto
   11 · Cursor custom (dot + ring)
   12 · Scrollspy (nav activo + índice de Información Útil)
   13 · Marquee infinito por GSAP ticker (reactivo al scroll)
   14 · Biglines: tipografía gigante scrubbed por scroll
   15 · Animaciones ambient (Ken Burns, flotación de diámetros)
   16 · Scroll suave con inercia (Lenis, sólo desktop)
   ============================================================ */

(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");

  // Las animaciones corren SIEMPRE (pieza comercial): no dependemos
  // de la config de accesibilidad del sistema operativo del visitante.
  const prefersReduced = false;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const hasGSAP = typeof window.gsap !== "undefined";

  if (!hasGSAP || prefersReduced) {
    document.documentElement.classList.add("no-gsap");
  }
  if (hasGSAP && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ============================================================
     01 · PRELOADER
     ============================================================ */
  const loader = document.getElementById("loader");

  const runIntro = () => {
    // Animación de entrada del hero (home y páginas internas)
    if (!hasGSAP || prefersReduced) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    const words = document.querySelectorAll(".hero__title .w, .phero__title .w");
    if (words.length) {
      tl.from(words, {
        yPercent: 110,
        opacity: 0,
        rotate: 2,
        duration: 0.9,
        stagger: 0.05,
      });
    }
    tl.from(
      [".hero__lead, .phero__lead", ".hero__actions, .phero__chips", ".hero__chips", ".breadcrumb"].map(s => document.querySelectorAll(s)).filter(n => n.length),
      { y: 26, opacity: 0, duration: 0.7, stagger: 0.12 },
      "-=0.45"
    );

    const frame = document.querySelector(".hero__frame, .phero__frame");
    if (frame) {
      tl.fromTo(frame,
        { clipPath: "inset(0% 0% 100% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "power4.inOut" },
      "-=0.9");
      const img = frame.querySelector("img");
      if (img) tl.from(img, { scale: 1.18, duration: 1.4, ease: "power3.out" }, "<");
    }

    const diam = document.querySelectorAll(".diam__circle, .diam__val");
    if (diam.length) {
      tl.from(diam, { scale: 0, opacity: 0, duration: 0.5, stagger: 0.04, ease: "back.out(2)" }, "-=0.7");
    }
  };

  if (loader && hasGSAP && !prefersReduced) {
    document.body.style.overflow = "hidden";
    const pct = loader.querySelector(".loader__pct");
    const bar = loader.querySelector(".loader__bar i");
    const iso = loader.querySelector(".loader__iso");
    const state = { v: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        loader.classList.add("is-done");
        document.body.style.overflow = "";
        runIntro();
      },
    });

    tl.to(iso, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" })
      .to(state, {
        v: 100,
        duration: 1.1,
        ease: "power2.inOut",
        onUpdate: () => {
          const n = Math.round(state.v);
          if (pct) pct.textContent = String(n).padStart(3, "0") + " %";
          if (bar) bar.style.transform = "scaleX(" + n / 100 + ")";
        },
      }, "-=0.2")
      .to([iso, loader.querySelector(".loader__bar"), pct], {
        opacity: 0, y: -14, duration: 0.35, stagger: 0.05,
      })
      .to(loader, {
        yPercent: -100,
        duration: 0.8,
        ease: "power4.inOut",
      });
  } else {
    if (loader) loader.style.display = "none";
    runIntro();
  }

  /* ============================================================
     02 · BARRA DE PROGRESO
     ============================================================ */
  const progress = document.getElementById("progress");
  if (progress) {
    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = "scaleX(" + (max > 0 ? window.scrollY / max : 0) + ")";
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    updateProgress();
  }

  /* ============================================================
     03 · HEADER INTELIGENTE
     ============================================================ */
  const header = document.getElementById("header");
  let lastY = window.scrollY;
  if (header) {
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      header.classList.toggle("is-scrolled", y > 10);
      // Ocultar al bajar / mostrar al subir (sólo pasado el hero)
      if (y > 420 && y > lastY + 6) header.classList.add("is-hidden");
      else if (y < lastY - 6 || y < 420) header.classList.remove("is-hidden");
      lastY = y;
    }, { passive: true });
    document.documentElement.style.setProperty("--header-h", header.offsetHeight + "px");
  }

  /* ============================================================
     04 · MENÚ MÓVIL + DROPDOWN
     ============================================================ */
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");

  if (burger && nav) {
    burger.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      burger.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        burger.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  document.querySelectorAll(".has-drop").forEach((drop) => {
    const trigger = drop.querySelector(".nav__link");
    const isDesktop = () => window.innerWidth > 768;

    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      drop.classList.toggle("is-open");
      trigger.setAttribute("aria-expanded", drop.classList.contains("is-open"));
    });
    drop.addEventListener("mouseenter", () => { if (isDesktop()) drop.classList.add("is-open"); });
    drop.addEventListener("mouseleave", () => { if (isDesktop()) drop.classList.remove("is-open"); });
    document.addEventListener("click", (e) => {
      if (!drop.contains(e.target)) drop.classList.remove("is-open");
    });
  });

  /* ============================================================
     05 · SPLIT TEXT (hero titles)
     Las palabras ya vienen envueltas en <span class="w"> desde
     el HTML para evitar FOUC; acá sólo se anima (ver runIntro).
     ============================================================ */

  /* ============================================================
     06 · REVEALS CON SCROLLTRIGGER
     ============================================================ */
  if (hasGSAP && window.ScrollTrigger && !prefersReduced) {
    // Grupos: los hijos de un [data-reveal-group] entran en stagger
    document.querySelectorAll("[data-reveal-group]").forEach((group) => {
      const items = group.children;
      gsap.from(items, {
        scrollTrigger: { trigger: group, start: "top 82%" },
        y: 44, opacity: 0, duration: 0.85,
        stagger: 0.09, ease: "power3.out",
      });
    });
    // Elementos sueltos
    document.querySelectorAll("[data-reveal]").forEach((el) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: "top 86%" },
        y: 36, opacity: 0, duration: 0.8, ease: "power3.out",
      });
    });
    // Títulos de sección con clip
    document.querySelectorAll("[data-reveal-title]").forEach((el) => {
      gsap.fromTo(el,
        { clipPath: "inset(0% 0% 100% 0%)", y: 24, opacity: 0 },
        {
          scrollTrigger: { trigger: el, start: "top 86%" },
          clipPath: "inset(0% 0% 0% 0%)", y: 0, opacity: 1,
          duration: 0.9, ease: "power3.out",
        });
    });
  }

  /* ============================================================
     07 · PARALLAX
     ============================================================ */
  if (hasGSAP && window.ScrollTrigger && !prefersReduced) {
    document.querySelectorAll("[data-parallax]").forEach((el) => {
      const depth = parseFloat(el.dataset.parallax) || 12;
      gsap.fromTo(el,
        { yPercent: -depth },
        {
          yPercent: depth,
          ease: "none",
          scrollTrigger: {
            trigger: el.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        }
      );
    });
  }

  /* ============================================================
     08 · CONTADORES
     ============================================================ */
  const counters = document.querySelectorAll("[data-count]");
  counters.forEach((el) => {
    const target = parseInt(el.dataset.count, 10);
    const setFinal = () => { el.textContent = el.dataset.format === "plain" ? target : target.toLocaleString("es-AR"); };

    if (!hasGSAP || prefersReduced || !window.ScrollTrigger) { setFinal(); return; }

    const state = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: "top 88%", once: true,
      onEnter: () => {
        gsap.to(state, {
          v: target, duration: 1.6, ease: "power2.out",
          onUpdate: () => { el.textContent = Math.round(state.v); },
          onComplete: setFinal,
        });
      },
    });
  });



  /* ============================================================
     10 · TILT 3D EN CARDS
     ============================================================ */
  if (hasGSAP && finePointer && !prefersReduced) {
    document.querySelectorAll(".card, .acc__item").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const rx = ((e.clientY - r.top) / r.height - 0.5) * -7;
        const ry = ((e.clientX - r.left) / r.width - 0.5) * 7;
        gsap.to(card, { rotateX: rx, rotateY: ry, y: -6, duration: 0.4, ease: "power2.out", transformPerspective: 900 });
      });
      card.addEventListener("mouseleave", () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, y: 0, duration: 0.6, ease: "power3.out" });
      });
    });
  }

 

  /* ============================================================
     12 · SCROLLSPY
     ============================================================ */
  // Índice lateral de Información Útil
  const iuLinks = document.querySelectorAll(".iu__index a");
  const iuBlocks = document.querySelectorAll(".iu__block[id]");
  if (iuLinks.length && iuBlocks.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          iuLinks.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === "#" + entry.target.id));
        }
      });
    }, { rootMargin: "-25% 0px -65% 0px" });
    iuBlocks.forEach((b) => io.observe(b));
  }

  /* ============================================================
     13 · LOOPS INFINITOS (marquee + biglines)
     Motor único: clona el contenido hasta cubrir 2 pantallas y
     desplaza con wrap por módulo del ancho de UNA copia, así el
     loop es matemáticamente perfecto: nunca se corta ni se frena.
     La velocidad del scroll lo acelera y lo inclina.
     ============================================================ */
  if (hasGSAP) {
    let scrollBoost = 0;
    let lastScrollY = window.scrollY;

    window.addEventListener("scroll", () => {
      const dy = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      scrollBoost += Math.min(Math.abs(dy) * 6, 420);
    }, { passive: true });

    gsap.ticker.add(() => {
      scrollBoost *= 0.9;
      if (scrollBoost < 0.5) scrollBoost = 0;
    });

    const makeLoop = (el, baseSpeed, dir, withSkew) => {
      // Ancho de una copia, antes de clonar
      const single = el.scrollWidth;
      if (!single) return;
      const target = Math.max(window.innerWidth * 2, single * 2);
      const original = el.innerHTML;
      while (el.scrollWidth < target + single) el.innerHTML += original;

      const state = { x: 0, skew: 0 };
      gsap.ticker.add((time, deltaMS) => {
        const dt = deltaMS / 1000;
        state.x += dir * (baseSpeed + scrollBoost) * dt * -1;
        // Normalizar a (-single, 0]
        state.x = ((state.x % single) + single) % single - single;
        if (withSkew) state.skew += (Math.min(scrollBoost / 40, 8) - state.skew) * 0.12;
        gsap.set(el, { x: state.x, skewX: withSkew ? state.skew : 0 });
      });
    };

    // Marquee "marcado de caño": rápido, con inclinación
    document.querySelectorAll(".pipeline__track").forEach((track) => {
      track.style.animation = "none"; // el ticker reemplaza al fallback CSS
      makeLoop(track, 70, 1, true);
    });

    // Biglines: lento y majestuoso, dirección alternada, sin inclinación
    document.querySelectorAll(".bigline span").forEach((span) => {
      const dir = span.closest(".bigline").dataset.dir === "right" ? -1 : 1;
      makeLoop(span, 26, dir, false);
    });
  }

  /* ============================================================
     15 · AMBIENT — movimiento continuo, también en mobile
     ============================================================ */
  if (hasGSAP && !prefersReduced) {
    // Ken Burns sutil en la imagen del hero (zoom respirado)
    const heroImg = document.querySelector(".hero__frame img, .phero__frame img");
    if (heroImg) {
      gsap.to(heroImg, {
        scale: 1.07, duration: 12,
        ease: "sine.inOut", yoyo: true, repeat: -1,
        delay: 2.5,
      });
    }
    // Los círculos de diámetro "respiran" en cascada
    const circles = document.querySelectorAll(".diam__circle");
    if (circles.length) {
      gsap.to(circles, {
        y: -7, duration: 1.8,
        ease: "sine.inOut", yoyo: true, repeat: -1,
        stagger: { each: 0.18 },
        delay: 3,
      });
    }
    // Anillo decorativo del CTA gira lento
    document.querySelectorAll(".ctaband").forEach((band) => {
      gsap.to(band, { "--ring-rot": 360, duration: 40, repeat: -1, ease: "none" });
    });
    // Swatches PEAD: brillo que recorre la franja
    const swatches = document.querySelectorAll(".pead__swatch");
    if (swatches.length) {
      gsap.fromTo(swatches, { opacity: 0.85 }, {
        opacity: 1, duration: 1.2, yoyo: true, repeat: -1,
        ease: "sine.inOut", stagger: 0.4,
      });
    }
  }

  /* ============================================================
     16 · SCROLL SUAVE CON INERCIA (Lenis) — sólo desktop
     En táctiles se mantiene el scroll nativo (mejor UX iOS/Android);
     el resto de las animaciones funcionan igual en mobile.
     ============================================================ */
  if (hasGSAP && window.ScrollTrigger && !prefersReduced && finePointer && typeof window.Lenis !== "undefined") {
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    // Anclas internas con el mismo easing
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (id.length > 1 && document.querySelector(id)) {
          e.preventDefault();
          lenis.scrollTo(id, { offset: -90 });
        }
      });
    });
  }

  /* Año del footer */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();
