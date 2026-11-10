
/* =========================================================
   STACKLY FITNESS — LOGIN JAVASCRIPT

   Features:
   1. Login form validation
   2. Registered account verification
   3. Password hash verification
   4. Show / Hide password
   5. Remember Me
   6. Signup success message
   7. Forgot password message
   8. Successful login redirect to Home

   Frontend demonstration only.
   Production authentication requires a secure backend.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const loginForm = document.getElementById("loginForm");

  if (!loginForm) return;

  const emailInput = document.getElementById("loginEmail");

  const passwordInput = document.getElementById("loginPassword");

  const rememberInput = document.getElementById("rememberMe");

  const loginButton = document.getElementById("loginSubmit");

  const loginMessage = document.getElementById("loginMessage");

  const forgotPasswordLink = document.getElementById(
    "forgotPasswordLink"
  );


  /* =====================================================
     1. DISPLAY MESSAGE
  ===================================================== */

  function showMessage(message, type) {

    loginMessage.textContent = message;

    loginMessage.className = `auth-message ${type}`;

    loginMessage.hidden = false;

  }


  function hideMessage() {

    loginMessage.textContent = "";

    loginMessage.className = "auth-message";

    loginMessage.hidden = true;

  }


  /* =====================================================
     2. FIELD ERROR HANDLING
  ===================================================== */

  function showError(fieldName, message) {

    const errorElement = loginForm.querySelector(
      `[data-error-for="${fieldName}"]`
    );

    if (errorElement) {

      errorElement.textContent = message;

    }

    const field = loginForm.elements.namedItem(fieldName);

    if (field) {

      field.classList.add("invalid");

      field.setAttribute("aria-invalid", "true");

    }

  }


  function clearError(fieldName) {

    const errorElement = loginForm.querySelector(
      `[data-error-for="${fieldName}"]`
    );

    if (errorElement) {

      errorElement.textContent = "";

    }

    const field = loginForm.elements.namedItem(fieldName);

    if (field) {

      field.classList.remove("invalid");

      field.removeAttribute("aria-invalid");

    }

  }


  function clearAllErrors() {

    loginForm.querySelectorAll(".auth-error").forEach((element) => {

      element.textContent = "";

    });

    loginForm.querySelectorAll(".invalid").forEach((field) => {

      field.classList.remove("invalid");

      field.removeAttribute("aria-invalid");

    });

  }


  /* =====================================================
     3. EMAIL VALIDATION
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
     4. PASSWORD VALIDATION
  ===================================================== */

  function validatePassword(value) {

    if (!value) {

      return "Please enter your password.";

    }

    return "";

  }


  /* =====================================================
     5. FORM VALIDATION
  ===================================================== */

  function validateForm() {

    clearAllErrors();

    let isValid = true;

    const emailError = validateEmail(emailInput.value);

    const passwordError = validatePassword(passwordInput.value);


    if (emailError) {

      showError("email", emailError);

      isValid = false;

    }


    if (passwordError) {

      showError("password", passwordError);

      isValid = false;

    }


    return isValid;

  }


  /* =====================================================
     6. SHOW / HIDE PASSWORD
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
     7. CLEAR ERRORS WHILE TYPING
  ===================================================== */

  emailInput.addEventListener("input", () => {

    clearError("email");

    hideMessage();

  });


  passwordInput.addEventListener("input", () => {

    clearError("password");

    hideMessage();

  });


  /* =====================================================
     8. PASSWORD HASHING
     Must match signup.js hashing method.
  ===================================================== */

  async function hashPassword(password) {

    if (!window.crypto || !window.crypto.subtle) {

      throw new Error(
        "Secure password verification is unavailable. Please use localhost or HTTPS."
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
     9. GET REGISTERED USERS
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
     10. VERIFY LOGIN DETAILS
  ===================================================== */

  async function verifyLogin(email, password) {

    // 1. Try backend API first if available
    try {
      const apiBase = window.location.origin.includes(":8000") ? "" : "http://127.0.0.1:8000";
      const res = await fetch(`${apiBase}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: password,
          remember: rememberInput ? rememberInput.checked : false
        })
      });

      if (res.ok) {
        const data = await res.json();
        return {
          success: true,
          user: data.user
        };
      } else if (res.status === 401 || res.status === 404) {
        const errorData = await res.json().catch(() => ({}));
        return {
          success: false,
          message: errorData.detail || "Invalid email or password."
        };
      }
    } catch (apiErr) {
      console.log("Backend API not reachable, falling back to local storage...", apiErr);
    }

    // 2. Fallback to localStorage registered users
    const users = getRegisteredUsers();

    const user = users.find((registeredUser) => {

      return registeredUser.email.toLowerCase() ===
        email.toLowerCase();

    });


    if (!user) {

      return {
        success: false,
        message: "No account found with this email. Please sign up first."
      };

    }


    const enteredPasswordHash = await hashPassword(password);


    if (enteredPasswordHash !== user.passwordHash) {

      return {
        success: false,
        message: "Incorrect password. Please try again."
      };

    }


    return {
      success: true,
      user: user
    };

  }


  /* =====================================================
     11. SAVE LOGIN SESSION
  ===================================================== */

  function saveLoginSession(user, rememberMe) {

    const loggedInUser = {

      id: user.id,

      name: user.name,

      email: user.email,

      phone: user.phone,

      loggedInAt: new Date().toISOString()

    };


    /*
      Remove previous frontend demo sessions.
    */

    // Always save to both localStorage and sessionStorage for cross-tab and persistent authentication
    localStorage.setItem(
      "stacklyCurrentUser",
      JSON.stringify(loggedInUser)
    );

    sessionStorage.setItem(
      "stacklyCurrentUser",
      JSON.stringify(loggedInUser)
    );

  }


  /* =====================================================
     12. SHOW SIGNUP SUCCESS MESSAGE
  ===================================================== */

  const signupSuccess = sessionStorage.getItem(
    "stacklySignupSuccess"
  );

  const prefillEmail = sessionStorage.getItem(
    "stacklyPrefillEmail"
  );


  if (signupSuccess) {

    showMessage(signupSuccess, "success");

    sessionStorage.removeItem("stacklySignupSuccess");

  }


  if (prefillEmail) {

    emailInput.value = prefillEmail;

    passwordInput.focus();

    sessionStorage.removeItem("stacklyPrefillEmail");

  }


  /* =====================================================
     13. FORGOT PASSWORD
  ===================================================== */

  if (forgotPasswordLink) {

    forgotPasswordLink.addEventListener("click", (event) => {

      event.preventDefault();

      showMessage(
        "Password reset is not configured yet. Please contact Stackly Fitness support for assistance.",
        "error"
      );

    });

  }


  /* =====================================================
     14. LOGIN FORM SUBMISSION
  ===================================================== */

  loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    if (loginButton.disabled) return;

    hideMessage();

    const isValid = validateForm();

    if (!isValid) {

      const firstInvalidField =
        loginForm.querySelector(".invalid");

      if (firstInvalidField) {

        firstInvalidField.focus();

      }

      return;

    }


    loginButton.disabled = true;

    loginButton.textContent = "Logging In...";


    try {

      const email = emailInput.value.trim().toLowerCase();

      const password = passwordInput.value;

      const result = await verifyLogin(email, password);


      if (!result.success) {

        showMessage(result.message, "error");

        loginButton.disabled = false;

        loginButton.innerHTML = "Log In <span>→</span>";

        return;

      }


      /* SAVE USER SESSION */

      saveLoginSession(result.user, rememberInput.checked);


      /* SHOW SUCCESS */

      showMessage(
        `Welcome back, ${result.user.name}! Redirecting to Home...`,
        "success"
      );


      /* REDIRECT TO HOMEPAGE */

      window.setTimeout(() => {

        window.location.href = "index.html";

      }, 1000);


    } catch (error) {

      console.error("Login error:", error);

      showMessage(
        error.message || "Unable to log in. Please try again.",
        "error"
      );

      loginButton.disabled = false;

      loginButton.innerHTML = "Log In <span>→</span>";

    }

  });


  /* =====================================================
     15. PAGE READY
  ===================================================== */

  console.log(
    "Stackly Fitness Login page loaded successfully."
  );

});

