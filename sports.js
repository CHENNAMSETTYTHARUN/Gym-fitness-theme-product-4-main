/* =========================================================
   STACKLY FITNESS — SPORTS PAGE JAVASCRIPT

   Features:
   1. Scroll reveal animations
   2. Smooth section navigation
   3. Sports card interactions
   4. Active navigation support
   5. Reduced motion accessibility

   Common header, footer and preloader are handled by common.js.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     1. REDUCED MOTION CHECK
  ===================================================== */

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;


  /* =====================================================
     2. SCROLL REVEAL
  ===================================================== */

  const revealElements = document.querySelectorAll(
    ".sports-page .reveal"
  );

  if (prefersReducedMotion) {

    revealElements.forEach((element) => {
      element.classList.add("visible");
    });

  } else if ("IntersectionObserver" in window) {

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            entry.target.classList.add("visible");

            observer.unobserve(entry.target);

          }

        });

      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });

  } else {

    revealElements.forEach((element) => {
      element.classList.add("visible");
    });

  }


  /* =====================================================
     3. SMOOTH SCROLL NAVIGATION
  ===================================================== */

  const internalLinks = document.querySelectorAll(
    '.sports-page a[href^="#"]'
  );

  internalLinks.forEach((link) => {

    link.addEventListener("click", (event) => {

      const targetSelector = link.getAttribute("href");

      if (!targetSelector || targetSelector === "#") {
        return;
      }

      const targetElement = document.querySelector(targetSelector);

      if (!targetElement) {
        return;
      }

      event.preventDefault();

      targetElement.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start"
      });

    });

  });


  /* =====================================================
     4. SPORTS CARD INTERACTIONS
  ===================================================== */

  const sportsCards = document.querySelectorAll(
    ".sports-card"
  );

  sportsCards.forEach((card) => {

    card.addEventListener("mouseenter", () => {
      card.classList.add("sports-card-active");
    });

    card.addEventListener("mouseleave", () => {
      card.classList.remove("sports-card-active");
    });

  });


  /* =====================================================
     5. BENEFIT CARD INTERACTIONS
  ===================================================== */

  const benefitCards = document.querySelectorAll(
    ".sports-benefit-card"
  );

  benefitCards.forEach((card) => {

    card.addEventListener("mouseenter", () => {
      card.classList.add("benefit-active");
    });

    card.addEventListener("mouseleave", () => {
      card.classList.remove("benefit-active");
    });

  });


  /* =====================================================
     6. ACTIVE NAVIGATION LINK
  ===================================================== */

  const currentPage = window.location.pathname
    .split("/")
    .pop()
    .toLowerCase();

  const navigationLinks = document.querySelectorAll(
    ".site-header nav a, .site-header .nav-links a"
  );

  navigationLinks.forEach((link) => {

    const href = link.getAttribute("href");

    if (!href) {
      return;
    }

    const linkPage = href
      .split("/")
      .pop()
      .split("#")[0]
      .toLowerCase();

    if (linkPage === currentPage) {

      link.classList.add("active");

      link.setAttribute("aria-current", "page");

    }

  });


  /* =====================================================
     7. IMAGE LOADING FALLBACK
  ===================================================== */

  const sportsImages = document.querySelectorAll(
    ".sports-page img"
  );

  sportsImages.forEach((img) => {

    img.addEventListener("error", () => {

      img.classList.add("image-load-error");

      console.warn(
        "Sports page image could not be loaded:",
        img.src
      );

    });

  });


  /* =====================================================
     8. PAGE READY
  ===================================================== */

  document.body.classList.add("sports-page-ready");

  console.log("Stackly Sports Page Loaded Successfully.");

});