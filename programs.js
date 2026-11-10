/* =========================================================
   STACKLY FITNESS — PROGRAMS PAGE JAVASCRIPT

   Handles:
   1. Scroll reveal animations
   2. Smooth category navigation
   3. Program card interactions
   4. Reduced motion accessibility

   Common header, footer and preloader are handled
   by common.js. Do not duplicate them here.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     1. REDUCED MOTION CHECK
  ===================================================== */

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;


  /* =====================================================
     2. SCROLL REVEAL ANIMATION
  ===================================================== */

  const revealElements = document.querySelectorAll(
    ".programs-page .reveal"
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
     3. CATEGORY SMOOTH SCROLL
  ===================================================== */

  const categoryLinks = document.querySelectorAll(
    ".category-item[href^='#']"
  );

  categoryLinks.forEach((link) => {

    link.addEventListener("click", (event) => {

      const targetSelector = link.getAttribute("href");

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
     4. PROGRAM CARD HOVER INTERACTION
  ===================================================== */

  const programCards = document.querySelectorAll(
    ".program-card"
  );

  programCards.forEach((card) => {

    card.addEventListener("mouseenter", () => {
      card.classList.add("program-card-active");
    });

    card.addEventListener("mouseleave", () => {
      card.classList.remove("program-card-active");
    });

  });


  /* =====================================================
     5. CTA BUTTON INTERACTION
  ===================================================== */

  const joinButtons = document.querySelectorAll(
    ".programs-page .program-btn"
  );

  joinButtons.forEach((button) => {

    button.addEventListener("click", () => {

      button.classList.add("program-button-clicked");

      window.setTimeout(() => {
        button.classList.remove("program-button-clicked");
      }, 250);

    });

  });


  /* =====================================================
     6. CURRENT PAGE ACTIVE NAVIGATION SUPPORT
  ===================================================== */

  const currentPage = window.location.pathname
    .split("/")
    .pop()
    .toLowerCase();

  const navLinks = document.querySelectorAll(
    ".site-header nav a, .site-header .nav-links a"
  );

  navLinks.forEach((link) => {

    const linkPage = link.getAttribute("href");

    if (!linkPage) {
      return;
    }

    const normalizedLink = linkPage
      .split("/")
      .pop()
      .toLowerCase();

    if (normalizedLink === currentPage) {

      link.classList.add("active");

      link.setAttribute("aria-current", "page");

    }

  });


  /* =====================================================
     7. ACCESSIBILITY FOR PROGRAM CARDS
  ===================================================== */

  programCards.forEach((card) => {

    const cardTitle = card.querySelector("h3");

    if (cardTitle) {

      card.setAttribute(
        "aria-label",
        cardTitle.textContent.trim()
      );

    }

  });


  /* =====================================================
     8. INITIAL PAGE STATE
  ===================================================== */

  document.body.classList.add("programs-page-ready");

  console.log("Stackly Programs Page Loaded Successfully.");

});