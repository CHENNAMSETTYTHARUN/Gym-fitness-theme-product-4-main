
/* =========================================================
   STACKLY FITNESS — SIGNUP JAVASCRIPT

   Features:
   1. Signup form validation
   2. Email duplicate checking
   3. Password confirmation
   4. Show / Hide password
   5. Terms validation
   6. Account registration
   7. Redirect to Login page

   Frontend demonstration only.
   Production authentication requires a secure backend.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const signupForm = document.getElementById("signupForm");

  if (!signupForm) return;

  const signupButton = document.getElementById("signupSubmit");

  const signupMessage = document.getElementById("signupMessage");

  const nameInput = document.getElementById("signupName");

  const emailInput = document.getElementById("signupEmail");

  const phoneInput = document.getElementById("signupPhone");

  const passwordInput = document.getElementById("signupPassword");

  const confirmPasswordInput = document.getElementById(
    "signupConfirmPassword"
  );

  const termsInput = document.getElementById("signupTerms");


  /* =====================================================
     1. MESSAGE DISPLAY
  ===================================================== */

  function showMessage(message, type) {

    signupMessage.textContent = message;

    signupMessage.className = `auth-message ${type}`;

    signupMessage.hidden = false;

  }


  function hideMessage() {

    signupMessage.textContent = "";

    signupMessage.className = "auth-message";

    signupMessage.hidden = true;

  }


  /* =====================================================
     2. FIELD ERROR HANDLING
  ===================================================== */

  function showError(fieldName, message) {

    const errorElement = signupForm.querySelector(
      `[data-error-for="${fieldName}"]`
    );

    if (errorElement) {

      errorElement.textContent = message;

    }

    const field = signupForm.elements.namedItem(fieldName);

    if (field) {

      field.classList.add("invalid");

      field.setAttribute("aria-invalid", "true");

    }

  }


  function clearError(fieldName) {

    const errorElement = signupForm.querySelector(
      `[data-error-for="${fieldName}"]`
    );

    if (errorElement) {

      errorElement.textContent = "";

    }

    const field = signupForm.elements.namedItem(fieldName);

    if (field) {

      field.classList.remove("invalid");

      field.removeAttribute("aria-invalid");

    }

  }


  function clearAllErrors() {

    signupForm.querySelectorAll(".auth-error").forEach((element) => {

      element.textContent = "";

    });

    signupForm.querySelectorAll(".invalid").forEach((field) => {

      field.classList.remove("invalid");

      field.removeAttribute("aria-invalid");

    });

  }


  /* =====================================================
     3. NAME VALIDATION
  ===================================================== */

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


  /* =====================================================
     4. EMAIL VALIDATION
  ===================================================== */

  function validateEmail(value) {

    const email = value.trim();

    if (!email) {

      return "Please enter your email address.";

    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!emailPattern.test(email)) {

      return "Please enter a valid email address.";

    }

    return "";

  }


  /* =====================================================
     5. PHONE VALIDATION
  ===================================================== */

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


  /* =====================================================
     6. PASSWORD VALIDATION
  ===================================================== */

  function validatePassword(value) {

    if (!value) {

      return "Please create a password.";

    }

    if (value.length < 8) {

      return "Password must contain at least 8 characters.";

    }

    if (!/[A-Z]/.test(value)) {

      return "Include at least one uppercase letter.";

    }

    if (!/[a-z]/.test(value)) {

      return "Include at least one lowercase letter.";

    }

    if (!/[0-9]/.test(value)) {

      return "Include at least one number.";

    }

    return "";

  }


  /* =====================================================
     7. CONFIRM PASSWORD VALIDATION
  ===================================================== */

  function validateConfirmPassword(password, confirmPassword) {

    if (!confirmPassword) {

      return "Please confirm your password.";

    }

    if (password !== confirmPassword) {

      return "Passwords do not match.";

    }

    return "";

  }


  /* =====================================================
     8. COMPLETE FORM VALIDATION
  ===================================================== */

  function validateForm() {

    clearAllErrors();

    let isValid = true;

    const validations = {

      name: validateName(nameInput.value),

      email: validateEmail(emailInput.value),

      phone: validatePhone(phoneInput.value),

      password: validatePassword(passwordInput.value),

      confirmPassword: validateConfirmPassword(
        passwordInput.value,
        confirmPasswordInput.value
      )

    };


    Object.entries(validations).forEach(([fieldName, error]) => {

      if (error) {

        showError(fieldName, error);

        isValid = false;

      }

    });


    if (!termsInput.checked) {

      showError(
        "terms",
        "Please accept the Terms & Conditions."
      );

      isValid = false;

    }


    return isValid;

  }


  /* =====================================================
     9. SHOW / HIDE PASSWORD
  ===================================================== */

  const passwordToggleButtons = document.querySelectorAll(
    "[data-toggle-password]"
  );

  passwordToggleButtons.forEach((button) => {

    button.addEventListener("click", () => {

      const inputId = button.dataset.togglePassword;

      const input = document.getElementById(inputId);

      if (!input) return;

      const isPassword = input.type === "password";

      input.type = isPassword ? "text" : "password";

      button.setAttribute(
        "aria-label",
        isPassword ? "Hide password" : "Show password"
      );

    });

  });


  /* =====================================================
     10. CLEAR ERRORS WHILE TYPING
  ===================================================== */

  const fields = [

    ["name", nameInput],

    ["email", emailInput],

    ["phone", phoneInput],

    ["password", passwordInput],

    ["confirmPassword", confirmPasswordInput],

    ["terms", termsInput]

  ];


  fields.forEach(([fieldName, field]) => {

    field.addEventListener("input", () => {

      clearError(fieldName);

      hideMessage();

    });

    field.addEventListener("change", () => {

      clearError(fieldName);

      hideMessage();

    });

  });


  /* =====================================================
     11. PASSWORD HASHING
  ===================================================== */

  async function hashPassword(password) {

    if (!window.crypto || !window.crypto.subtle) {

      throw new Error(
        "Secure password hashing is unavailable. Please open the website using localhost or HTTPS."
      );

    }

    const encoder = new TextEncoder();

    const passwordData = encoder.encode(password);

    const hashBuffer = await crypto.subtle.digest(
      "SHA-256",
      passwordData
    );

    const hashArray = Array.from(new Uint8Array(hashBuffer));

    return hashArray
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");

  }


  /* =====================================================
     12. GET REGISTERED USERS
  ===================================================== */

  function getRegisteredUsers() {

    try {

      const savedUsers = localStorage.getItem("stacklyUsers");

      if (!savedUsers) return [];

      const users = JSON.parse(savedUsers);

      return Array.isArray(users) ? users : [];

    } catch (error) {

      console.error("Unable to read registered users:", error);

      return [];

    }

  }


  /* =====================================================
     13. EMAIL DUPLICATE CHECK
  ===================================================== */

  function emailAlreadyExists(email) {

    const users = getRegisteredUsers();

    return users.some((user) => {

      return user.email.toLowerCase() === email.toLowerCase();

    });

  }


  /* =====================================================
     14. SAVE NEW ACCOUNT
  ===================================================== */

  async function registerAccount() {

    const fullName = nameInput.value.trim();

    const email = emailInput.value.trim().toLowerCase();

    const phone = phoneInput.value.trim();

    const password = passwordInput.value;

    // 1. Try real backend API first if available
    try {
      const apiBase = window.location.origin.includes(":8000") ? "" : "http://127.0.0.1:8000";
      const res = await fetch(`${apiBase}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          email: email,
          phone: phone,
          password: password,
          confirmPassword: confirmPasswordInput.value,
          terms: termsInput.checked
        })
      });

      if (res.ok) {
        const data = await res.json();
        const users = getRegisteredUsers();
        if (!users.some((u) => u.email.toLowerCase() === email)) {
          users.push({
            id: data.user?.id || `user_${Date.now()}`,
            name: fullName,
            email: email,
            phone: phone,
            passwordHash: await hashPassword(password),
            createdAt: new Date().toISOString()
          });
          localStorage.setItem("stacklyUsers", JSON.stringify(users));
        }
        return true;
      } else if (res.status === 409) {
        showError("email", "This email is already registered. Please log in.");
        emailInput.focus();
        return false;
      } else {
        const errData = await res.json().catch(() => ({}));
        showError("password", errData.detail || "Registration failed. Please check inputs.");
        return false;
      }
    } catch (apiErr) {
      console.log("Backend API not reachable, falling back to local storage...", apiErr);
    }

    // 2. Fallback to localStorage duplicate check
    if (emailAlreadyExists(email)) {

      showError(
        "email",
        "This email is already registered. Please log in."
      );

      emailInput.focus();

      return false;

    }


    const passwordHash = await hashPassword(password);

    const users = getRegisteredUsers();


    const newUser = {

      id: `user_${Date.now()}`,

      name: fullName,

      email: email,

      phone: phone,

      passwordHash: passwordHash,

      createdAt: new Date().toISOString()

    };


    users.push(newUser);


    try {

      localStorage.setItem(
        "stacklyUsers",
        JSON.stringify(users)
      );

    } catch (error) {

      throw new Error(
        "Unable to save your account. Please check your browser storage."
      );

    }


    return true;

  }


  /* =====================================================
     15. SIGNUP SUBMISSION
  ===================================================== */

  signupForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    hideMessage();

    if (signupButton.disabled) return;


    const isValid = validateForm();

    if (!isValid) {

      const firstInvalidField = signupForm.querySelector(".invalid");

      if (firstInvalidField) {

        firstInvalidField.focus();

      }

      return;

    }


    signupButton.disabled = true;

    signupButton.textContent = "Creating Account...";


    try {

      const registered = await registerAccount();

      if (!registered) {

        signupButton.disabled = false;

        signupButton.innerHTML =
          'Create Account <span>→</span>';

        return;

      }


      /*
        Store temporary success message for Login page.
      */

      sessionStorage.setItem(
        "stacklySignupSuccess",
        "Account created successfully! Please log in."
      );

      sessionStorage.setItem(
        "stacklyPrefillEmail",
        emailInput.value.trim().toLowerCase()
      );


      showMessage(
        "Account created successfully! Redirecting to Login...",
        "success"
      );


      window.setTimeout(() => {

        window.location.href = "login.html";

      }, 1200);


    } catch (error) {

      console.error("Signup error:", error);

      showMessage(
        error.message || "Something went wrong. Please try again.",
        "error"
      );

      signupButton.disabled = false;

      signupButton.innerHTML =
        'Create Account <span>→</span>';

    }

  });


  /* =====================================================
     16. PAGE READY
  ===================================================== */

  console.log(
    "Stackly Fitness Signup page loaded successfully."
  );

});

