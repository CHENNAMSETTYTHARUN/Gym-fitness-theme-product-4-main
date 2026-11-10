/* =========================================================
STACKLY FITNESS WEBSITE
COMMON JAVASCRIPT - FINAL VERSION

Common:

1. Preloader
2. Header
3. Navigation
4. Footer
5. Email Subscription Toast
6. Back To Top
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {


/* =====================================================
   COMMON PRELOADER - PRESERVED
===================================================== */

document.body.classList.add("loading");

const preloader = document.createElement("div");

preloader.id = "stackly-preloader";

preloader.innerHTML = `

    <div class="preloader-glow"></div>

    <div class="preloader-particles">

        <span class="preloader-particle"></span>
        <span class="preloader-particle"></span>
        <span class="preloader-particle"></span>
        <span class="preloader-particle"></span>
        <span class="preloader-particle"></span>
        <span class="preloader-particle"></span>

    </div>

    <div class="preloader-content">

        <div class="preloader-image-wrap">

            <div class="preloader-energy-ring"></div>

            <img
                src="assets/dumbell preloader.webp"
                alt="STACKLY Dumbbell"
                class="preloader-dumbbell"
            >

        </div>

        <img
            src="assets/stackly logo.webp"
            alt="STACKLY Logo"
            class="preloader-logo"
        >

        <p class="preloader-tagline">
            MOVE BETTER. FEEL STRONGER.
        </p>

        <p class="preloader-loading-text">
            GETTING STRONGER...
        </p>

        <div class="preloader-progress">

            <div class="preloader-progress-fill"></div>

        </div>

    </div>

`;

document.body.prepend(preloader);

const progressFill = preloader.querySelector(
    ".preloader-progress-fill"
);

let progress = 0;

const startTime = Date.now();

const minimumDuration = 1800;

const progressInterval = setInterval(() => {

    if (progress < 90) {

        progress += Math.random() * 5;

        progress = Math.min(progress, 90);

        progressFill.style.width = progress + "%";

    }

}, 100);

let preloaderFinished = false;

function finishPreloader() {

    if (preloaderFinished) return;

    preloaderFinished = true;

    const elapsed = Date.now() - startTime;

    const remaining = Math.max(
        0,
        minimumDuration - elapsed
    );

    setTimeout(() => {

        clearInterval(progressInterval);

        progressFill.style.width = "100%";

        setTimeout(() => {

            preloader.classList.add("preloader-hidden");

            document.body.classList.remove("loading");

            setTimeout(() => {

                preloader.remove();

            }, 850);

        }, 250);

    }, remaining);

}

if (document.readyState === "complete") {

    finishPreloader();

} else {

    window.addEventListener(
        "load",
        finishPreloader,
        { once: true }
    );

}


/* =====================================================
   COMMON HEADER - PRESERVED
===================================================== */

function getLoggedInUser() {
    try {
        const stored = localStorage.getItem("stacklyCurrentUser") || sessionStorage.getItem("stacklyCurrentUser");
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.error("Unable to read logged-in user:", e);
    }
    return null;
}

window.getLoggedInUser = getLoggedInUser;

function renderSiteHeader() {
    const headerContainer = document.getElementById("siteHeader");
    if (!headerContainer) return;

    const currentUser = getLoggedInUser();

    const authHtml = currentUser && currentUser.name ? `
        <span class="header-login header-user-btn" id="headerUserBtn" title="Logged in as ${currentUser.email || currentUser.name}">
            👤 ${currentUser.name}
        </span>
        <button class="header-logout-btn" id="headerLogoutBtn" type="button" aria-label="Log out">
            Logout
        </button>
    ` : `
        <a href="login.html" class="header-login" id="headerLoginBtn">
            Login
        </a>
    `;

    headerContainer.innerHTML = `
        <header class="site-header">
            <a href="index.html" class="header-logo">
                <img src="assets/stackly logo.webp" alt="STACKLY Logo">
            </a>
            <nav class="header-navigation" id="headerNavigation">
                <a href="index.html">Home</a>
                <a href="programs.html">Programs</a>
                <a href="sports.html">Sports</a>
                <a href="about.html">About</a>
            </nav>
            <div class="header-actions">
                <form class="header-search" id="headerSearch">
                    <input type="search" placeholder="Search..." aria-label="Search website">
                    <button type="submit" aria-label="Search">&#128269;</button>
                </form>
                ${authHtml}
                <button class="menu-toggle" id="menuToggle" aria-label="Open navigation menu" aria-expanded="false" type="button">
                    ☰
                </button>
            </div>
        </header>
    `;

    // Logout click handler
    const logoutBtn = document.getElementById("headerLogoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", async () => {
            try {
                const apiBase = window.location.origin.includes(":8000") ? "" : "http://127.0.0.1:8000";
                await fetch(`${apiBase}/api/logout`, { method: "POST" });
            } catch (e) {}

            localStorage.removeItem("stacklyCurrentUser");
            sessionStorage.removeItem("stacklyCurrentUser");

            if (typeof showToast === "function") {
                showToast("Logged out successfully.");
            }

            renderSiteHeader();

            if (typeof updateHomeUserState === "function") {
                updateHomeUserState();
            }
        });
    }

    setupHeaderInteractions();
}

window.renderSiteHeader = renderSiteHeader;
renderSiteHeader();

function setupHeaderInteractions() {
    // 1. Highlight active navigation link
    const currentPage = (
        window.location.pathname.split("/").pop() || "index.html"
    ).toLowerCase();

    document.querySelectorAll(".header-navigation a").forEach(link => {
        const linkPage = (link.getAttribute("href") || "").toLowerCase();
        if (linkPage === currentPage) {
            link.classList.add("active");
        }
    });

    // 2. Mobile hamburger menu
    const menuToggle = document.getElementById("menuToggle");
    const headerNavigation = document.getElementById("headerNavigation");
    let savedScrollPosition = 0;

    if (menuToggle && headerNavigation) {
        function openMobileMenu() {
            savedScrollPosition = window.scrollY;
            headerNavigation.classList.add("mobile-open");
            menuToggle.setAttribute("aria-expanded", "true");
            menuToggle.innerHTML = "&times;";
            document.body.style.position = "fixed";
            document.body.style.top = `-${savedScrollPosition}px`;
            document.body.style.width = "100%";
            document.body.style.overflow = "hidden";
        }

        function closeMobileMenu() {
            headerNavigation.classList.remove("mobile-open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.innerHTML = "☰";
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.width = "";
            document.body.style.overflow = "";
            window.scrollTo(0, savedScrollPosition);
        }

        menuToggle.onclick = () => {
            const isOpen = headerNavigation.classList.contains("mobile-open");
            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        };

        headerNavigation.querySelectorAll("a").forEach(link => {
            link.onclick = () => {
                if (headerNavigation.classList.contains("mobile-open")) {
                    closeMobileMenu();
                }
            };
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && headerNavigation.classList.contains("mobile-open")) {
                closeMobileMenu();
            }
        });
    }

    // 3. Header search form
    const searchForm = document.getElementById("headerSearch");
    if (searchForm) {
        searchForm.onsubmit = (event) => {
            event.preventDefault();
            const input = searchForm.querySelector("input");
            const searchValue = input ? input.value.trim() : "";
            if (!searchValue) {
                if (input) input.focus();
                return;
            }
            window.location.href = "programs.html?search=" + encodeURIComponent(searchValue);
        };
    }
}

// Call interactions inside renderSiteHeader

setupHeaderInteractions();



/* =====================================================
   COMMON FOOTER
===================================================== */

const footerContainer = document.getElementById("siteFooter");

if (footerContainer) {

    footerContainer.innerHTML = `

        <footer class="site-footer">

            <div class="footer-container">

                <!-- BRAND -->

                <div class="footer-brand">

                    <img
                        src="assets/stackly logo.webp"
                        alt="STACKLY Logo"
                        class="footer-logo"
                    >

                    <span class="footer-tagline">
                        Move Better. Your Stronger Chapter.
                    </span>

                    <p>
                        Helping you discover your strength.
                        Explore thoughtfully designed fitness
                        programs and take the next step with confidence.
                    </p>

                    <div class="footer-socials">

                        <a href="https://www.facebook.com/people/Stackly-Stackly/pfbid02NmgSaxmeD8WJngqrhKudvxzak9GvzPLz6YS9NMdJJM9rSeJ7ZTyG6h3HF3p3koBEl/?rdid=3qmngFeLJe3ChGfe&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1BrqaZkJRe%2F" target="_blank" rel="noopener noreferrer" aria-label="Facebook">

                            <svg viewBox="0 0 24 24">
                                <path d="M13.5 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.2v2.2H7.7V13h2.7v8z"/>
                            </svg>

                        </a>

                        <a href="https://www.instagram.com/thestackly" target="_blank" rel="noopener noreferrer" aria-label="Instagram">

                            <svg viewBox="0 0 24 24">
                                <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm5.5-3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z"/>
                            </svg>

                        </a>

                        <a href="https://www.linkedin.com/company/the-stackly/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">

                            <svg viewBox="0 0 24 24">
                                <path d="M5 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM3.2 8.5h3.6V21H3.2zM9 8.5h3.5v1.7h.1a3.9 3.9 0 0 1 3.5-1.9c3.7 0 4.4 2.4 4.4 5.5V21h-3.7v-6.4c0-1.5 0-3.4-2.1-3.4s-2.4 1.6-2.4 3.3V21H9z"/>
                            </svg>

                        </a>

                        <a href="https://x.com/The_Stackly" target="_blank" rel="noopener noreferrer" aria-label="Twitter">

                            <svg viewBox="0 0 24 24">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                            </svg>

                        </a>

                    </div>

                </div>


                <!-- QUICK LINKS -->

                <div class="footer-column">

                    <h3>Quick Links</h3>

                    <a href="index.html">Home</a>

                    <a href="programs.html">Programs</a>

                    <a href="sports.html">Sports</a>

                    <a href="about.html">About</a>

                </div>


                <!-- ACCOUNT -->

                <div class="footer-column">

                    <h3>Your Account</h3>

                    <a href="login.html">Login</a>

                    <a href="signup.html">Signup</a>

                    <a href="signup.html">Membership Plans</a>

                    <a href="programs.html">Browse Programs</a>

                </div>


                <!-- CONTACT -->

<div class="footer-column footer-contact-column">

    <h3>Get in Touch</h3>

    <div class="footer-contact-content">

        <div class="footer-contact-item">

            <span class="footer-contact-icon">●</span>

            <span>
                Salem, Tamil Nadu, India
            </span>

        </div>

        <div class="footer-contact-item">

            <span class="footer-contact-icon">✉</span>

            <span>
                hello@stackly.example
            </span>

        </div>

        <div class="footer-contact-item">

            <span class="footer-contact-icon">◷</span>

            <span>
                Monday – Sunday, 4:00 AM – 10:00 PM
            </span>

        </div>

    </div>


    <!-- EMAIL SUBSCRIPTION -->

    <div class="footer-subscribe">

        <h4>Get Fitness Updates</h4>

        <form
            class="footer-email-form"
            id="footerEmailForm"
            novalidate
        >

            <input
                type="email"
                id="footerEmail"
                placeholder="Your email address"
                aria-label="Your email address"
                required
            >

            <button
                type="submit"
                aria-label="Subscribe"
            >
                →
            </button>

        </form>

    </div>

</div>


            <!-- FOOTER BOTTOM -->

            <div class="footer-bottom">

                <p>
                    © ${new Date().getFullYear()}
                    Stackly. All rights reserved.
                </p>

                <div class="footer-legal">

                    <a href="privacy-policy.html">Privacy Policy</a>

                    <a href="terms-of-use.html">Terms of Use</a>

                </div>

            </div>

        </footer>


        <!-- BACK TO TOP -->

        <button
            class="back-to-top"
            id="backToTop"
            type="button"
            aria-label="Back to top"
        >
            ↑
        </button>


        <!-- TOAST -->

        <div
            class="stackly-toast"
            id="stacklyToast"
            role="status"
            aria-live="polite"
        >

            <span class="toast-icon">✓</span>

            <span id="toastMessage"></span>

        </div>

    `;

}


/* =====================================================
   EMAIL SUBSCRIPTION
   FRONTEND VALIDATION + SUCCESS TOAST
===================================================== */

const footerEmailForm = document.getElementById(
    "footerEmailForm"
);

const footerEmail = document.getElementById("footerEmail");

const toast = document.getElementById("stacklyToast");

const toastMessage = document.getElementById("toastMessage");

let toastTimer;

function showToast(message) {

    if (!toast || !toastMessage) return;

    clearTimeout(toastTimer);

    toastMessage.textContent = message;

    toast.classList.add("show");

    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 4000);

}

if (footerEmailForm && footerEmail) {

    footerEmailForm.addEventListener("submit", event => {

        event.preventDefault();

        const emailValue = footerEmail.value.trim();

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

        if (!emailValue) {

            footerEmail.setCustomValidity(
                "Please enter your email address."
            );

            footerEmail.reportValidity();

            footerEmail.setCustomValidity("");

            return;

        }

        if (!emailPattern.test(emailValue)) {

            footerEmail.setCustomValidity(
                "Please enter a valid email address."
            );

            footerEmail.reportValidity();

            footerEmail.setCustomValidity("");

            return;

        }

        /*
           FRONTEND DEMO:
           This form validates the email and displays
           a confirmation toast. Actual email delivery
           requires a backend or email service.
        */

        footerEmailForm.reset();

        showToast("Our team will contact you soon!");

    });

}


/* =====================================================
   BACK TO TOP
===================================================== */

const backToTop = document.getElementById("backToTop");

if (backToTop) {

    function updateBackToTop() {

        if (window.scrollY > 350) {

            backToTop.classList.add("show");

        } else {

            backToTop.classList.remove("show");

        }

    }

    window.addEventListener(
        "scroll",
        updateBackToTop,
        { passive: true }
    );

    updateBackToTop();

    backToTop.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}


/* =====================================================
   SMOOTH INTERNAL ANCHORS
===================================================== */

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", event => {

        const targetId = link.getAttribute("href");

        if (targetId === "#") {

            event.preventDefault();

            return;

        }

        const target = document.querySelector(targetId);

        if (target) {

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    });

});


console.log('STACKLY Common Components Initialized');
});
