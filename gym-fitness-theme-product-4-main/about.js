
/* =========================================================
   STACKLY FITNESS — ABOUT PAGE JAVASCRIPT

   Features:
   1. Scroll reveal animations
   2. Smooth internal navigation
   3. Active navigation link
   4. Enquiry form validation
   5. Success messages
   6. Automatic form reset
   7. Message character counter
   8. Image loading checks

   Common header, footer and preloader untouched.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const aboutPage = document.querySelector(".about-page");

  if (!aboutPage) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;


  /* =====================================================
     1. SCROLL REVEAL
  ===================================================== */

  const revealElements = aboutPage.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right"
  );

  if ("IntersectionObserver" in window && !prefersReducedMotion) {

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            entry.target.classList.add("active");

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
      element.classList.add("active");
    });

  }


  /* =====================================================
     2. SMOOTH INTERNAL SCROLL
  ===================================================== */

  const internalLinks = aboutPage.querySelectorAll(
    'a[href^="#"]'
  );

  internalLinks.forEach((link) => {

    link.addEventListener("click", (event) => {

      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const targetElement = document.querySelector(targetId);

      if (!targetElement) return;

      event.preventDefault();

      targetElement.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start"
      });

    });

  });


  /* =====================================================
     3. ACTIVE NAVIGATION
  ===================================================== */

  function updateAboutActiveLink() {

    const currentPage = window.location.pathname
      .split("/")
      .pop()
      .toLowerCase();

    const navLinks = document.querySelectorAll(
      ".site-header nav a, " +
      ".site-header .nav-links a, " +
      "header nav a, " +
      "header .nav-links a"
    );

    navLinks.forEach((link) => {

      const href = link.getAttribute("href");

      if (!href || href.startsWith("#")) return;

      const linkPage = href
        .split("/")
        .pop()
        .split("?")[0]
        .toLowerCase();

      if (linkPage === currentPage && currentPage === "about.html") {

        link.classList.add("active");

        link.setAttribute("aria-current", "page");

      } else {

        link.classList.remove("active");

        link.removeAttribute("aria-current");

      }

    });

  }

  updateAboutActiveLink();


  /* =====================================================
     4. IMAGE LOADING CHECK
  ===================================================== */

  const pageImages = aboutPage.querySelectorAll("img");

  pageImages.forEach((img) => {

    img.addEventListener("error", () => {

      console.warn(
        "About page image could not be loaded:",
        img.src
      );

      img.classList.add("image-load-error");

    });

    img.addEventListener("load", () => {

      img.classList.add("image-loaded");

    });

  });


  /* =====================================================
     5. ENQUIRY FORM ELEMENTS
  ===================================================== */

  const enquiryForm = document.getElementById(
    "aboutEnquiryForm"
  );

  if (enquiryForm) {

    const submitButton = document.getElementById(
      "aboutEnquirySubmit"
    );

    const successMessage = document.getElementById(
      "aboutFormSuccess"
    );

    const messageInput = document.getElementById(
      "enquiryMessage"
    );

    const messageCount = document.getElementById(
      "aboutMessageCount"
    );

    let successTimer = null;


    /* =================================================
       6. CHARACTER COUNTER
    ================================================= */

    if (messageInput && messageCount) {

      messageInput.addEventListener("input", () => {

        messageCount.textContent =
          messageInput.value.length;

      });

    }


    /* =================================================
       7. FIELD ERROR HELPERS
    ================================================= */

    function showFieldError(fieldName, message) {

      const errorElement = enquiryForm.querySelector(
        `[data-error-for="${fieldName}"]`
      );

      if (errorElement) {

        errorElement.textContent = message;

      }

      const field = enquiryForm.elements.namedItem(fieldName);

      if (field && field.type !== "checkbox") {

        field.classList.add("invalid");

        field.setAttribute("aria-invalid", "true");

      }

    }


    function clearFieldError(fieldName) {

      const errorElement = enquiryForm.querySelector(
        `[data-error-for="${fieldName}"]`
      );

      if (errorElement) {

        errorElement.textContent = "";

      }

      const field = enquiryForm.elements.namedItem(fieldName);

      if (field) {

        field.classList.remove("invalid");

        field.removeAttribute("aria-invalid");

      }

    }


    function clearAllErrors() {

      const errorElements = enquiryForm.querySelectorAll(
        ".about-field-error"
      );

      errorElements.forEach((element) => {

        element.textContent = "";

      });

      const invalidFields = enquiryForm.querySelectorAll(
        ".invalid"
      );

      invalidFields.forEach((field) => {

        field.classList.remove("invalid");

        field.removeAttribute("aria-invalid");

      });

    }


    /* =================================================
       8. VALIDATION HELPERS
    ================================================= */

    function validateName(value) {

      const name = value.trim();

      if (!name) {

        return "Please enter your full name.";

      }

      if (name.length < 2) {

        return "Name must contain at least 2 characters.";

      }

      if (!/^[\p{L}\p{M}][\p{L}\p{M}\s.'-]*$/u.test(name)) {

        return "Please enter a valid name.";

      }

      return "";

    }


    function validateAge(value) {

      if (!value.trim()) {

        return "Please enter your age.";

      }

      const age = Number(value);

      if (!Number.isInteger(age) || age < 16 || age > 100) {

        return "Age must be between 16 and 100.";

      }

      return "";

    }


    function validateEmail(value) {

      const email = value.trim();

      if (!email) {

        return "Please enter your email address.";

      }

      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

      if (!emailPattern.test(email)) {

        return "Please enter a valid email address.";

      }

      return "";

    }


    function validatePhone(value) {

      const phone = value.trim();

      if (!phone) {

        return "Please enter your phone number.";

      }

      const cleanedPhone = phone.replace(/[\s()-]/g, "");

      if (!/^\+?\d{10,15}$/.test(cleanedPhone)) {

        return "Enter a valid phone number with 10–15 digits.";

      }

      return "";

    }


    function validateSelect(value, message) {

      if (!value) {

        return message;

      }

      return "";

    }


    /* =================================================
       9. COMPLETE FORM VALIDATION
    ================================================= */

    function validateEnquiryForm() {

      clearAllErrors();

      let isValid = true;

      const formData = new FormData(enquiryForm);

      const values = {

        name: formData.get("name") || "",

        age: formData.get("age") || "",

        gender: formData.get("gender") || "",

        email: formData.get("email") || "",

        phone: formData.get("phone") || "",

        program: formData.get("program") || "",

        experience: formData.get("experience") || "",

        goal: formData.get("goal") || ""

      };


      const validations = {

        name: validateName(values.name),

        age: validateAge(values.age),

        gender: validateSelect(
          values.gender,
          "Please select your gender."
        ),

        email: validateEmail(values.email),

        phone: validatePhone(values.phone),

        program: validateSelect(
          values.program,
          "Please select an interested program."
        ),

        experience: validateSelect(
          values.experience,
          "Please select your fitness experience."
        ),

        goal: validateSelect(
          values.goal,
          "Please select your fitness goal."
        )

      };


      Object.entries(validations).forEach(
        ([fieldName, errorMessage]) => {

          if (errorMessage) {

            showFieldError(fieldName, errorMessage);

            isValid = false;

          }

        }
      );


      /* CONSENT VALIDATION */

      const consent = document.getElementById(
        "enquiryConsent"
      );

      if (!consent.checked) {

        showFieldError(
          "consent",
          "Please agree to be contacted regarding your enquiry."
        );

        isValid = false;

      }


      return isValid;

    }


    /* =================================================
       10. CLEAR ERRORS WHILE TYPING
    ================================================= */

    const clearOnChangeFields = [
      "name",
      "age",
      "gender",
      "email",
      "phone",
      "program",
      "experience",
      "goal",
      "consent"
    ];

    clearOnChangeFields.forEach((fieldName) => {

      const field = enquiryForm.elements.namedItem(fieldName);

      if (!field) return;

      field.addEventListener("input", () => {

        clearFieldError(fieldName);

      });

      field.addEventListener("change", () => {

        clearFieldError(fieldName);

      });

    });


    /* =================================================
       11. SUCCESS MESSAGE
    ================================================= */

    function showSuccessMessage() {

      if (!successMessage) return;

      successMessage.hidden = false;

      successMessage.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "nearest"
      });

      /*
        Both messages are displayed together:

        Enquiry Submitted Successfully!
        Our team will contact you soon.

        After 4 seconds:
        - Messages disappear
        - Form resets
        - Button becomes available again
      */

      successTimer = window.setTimeout(() => {

        successMessage.hidden = true;

        enquiryForm.reset();

        clearAllErrors();

        if (messageCount) {

          messageCount.textContent = "0";

        }

        submitButton.disabled = false;

        submitButton.innerHTML =
          'Submit Enquiry <span>→</span>';

        successTimer = null;

      }, 4000);

    }


    /* =================================================
       12. FORM SUBMISSION
    ================================================= */

    enquiryForm.addEventListener("submit", (event) => {

      event.preventDefault();

      if (submitButton.disabled) return;

      if (successTimer) {

        clearTimeout(successTimer);

        successTimer = null;

      }

      if (successMessage) {

        successMessage.hidden = true;

      }


      /* VALIDATE */

      const isValid = validateEnquiryForm();

      if (!isValid) {

        const firstInvalidField =
          enquiryForm.querySelector(".invalid") ||
          document.getElementById("enquiryConsent");

        if (firstInvalidField) {

          firstInvalidField.focus();

          firstInvalidField.scrollIntoView({
            behavior: prefersReducedMotion ? "auto" : "smooth",
            block: "center"
          });

        }

        return;

      }


      /* COLLECT ENQUIRY DETAILS */

      const formData = new FormData(enquiryForm);

      const enquiryDetails = {

        name: formData.get("name"),

        age: formData.get("age"),

        gender: formData.get("gender"),

        email: formData.get("email"),

        phone: formData.get("phone"),

        program: formData.get("program"),

        experience: formData.get("experience"),

        trainingTime: formData.get("trainingTime"),

        goal: formData.get("goal"),

        message: formData.get("message"),

        submittedAt: new Date().toISOString()

      };


      /*
        Frontend demonstration only.

        Backend / database / email integration
        can be added separately.
      */

      console.log(
        "Stackly Fitness Enquiry:",
        enquiryDetails
      );


      /* DISABLE BUTTON TEMPORARILY */

      submitButton.disabled = true;

      submitButton.textContent = "Submitting...";


      /* SHOW SUCCESS */

      window.setTimeout(() => {

        showSuccessMessage();

      }, 400);

    });

  }


  /* =====================================================
     13. PAGE READY
  ===================================================== */

  document.body.classList.add("about-page-ready");

  console.log(
    "Stackly Fitness About page loaded successfully."
  );

});

