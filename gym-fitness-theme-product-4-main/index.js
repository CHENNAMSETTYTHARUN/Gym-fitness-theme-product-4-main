/* =========================================================
STACKLY FITNESS WEBSITE
HOME PAGE JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {


/* =====================================================
   01. SCROLL REVEAL
===================================================== */

const revealElements = document.querySelectorAll(
    ".section-heading, " +
    ".program-tags, " +
    ".passion-description, " +
    ".passion-card, " +
    ".trainer-heading, " +
    ".trainer-card, " +
    ".membership-heading, " +
    ".membership-card, " +
    ".testimonial-heading, " +
    ".testimonial-card"
);


revealElements.forEach((element, index) => {

    element.classList.add("reveal");

    if (element.classList.contains("passion-card")) {

        element.style.transitionDelay =
            `${(index % 4) * 100}ms`;

    }

});


/* Intersection Observer */

if ("IntersectionObserver" in window) {

    const revealObserver = new IntersectionObserver(

        (entries, observer) => {

            entries.forEach(entry => {

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


    revealElements.forEach(element => {

        revealObserver.observe(element);

    });

} else {

    revealElements.forEach(element => {

        element.classList.add("visible");

    });

}


/* =====================================================
   02. IMAGE LOADING FALLBACK
===================================================== */

document.querySelectorAll("img").forEach(image => {

    image.addEventListener("error", () => {

        image.classList.add("image-load-error");

        console.warn(
            "STACKLY image could not be loaded:",
            image.src
        );

    });

});


/* =====================================================
   03. MEMBERSHIP PLAN SELECTION
===================================================== */

document.querySelectorAll(".plan-btn").forEach(button => {

    button.addEventListener("click", () => {

        const url = new URL(
            button.href,
            window.location.origin
        );

        const selectedPlan = url.searchParams.get("plan");

        if (selectedPlan) {

            sessionStorage.setItem(
                "stacklySelectedPlan",
                selectedPlan
            );

        }

    });

});


/* =====================================================
   04. HERO BUTTON INTERACTION
===================================================== */

const heroButton = document.querySelector(".hero-btn");

if (heroButton) {

    heroButton.addEventListener("mouseenter", () => {

        heroButton.classList.add("hero-btn-hover");

    });

    heroButton.addEventListener("mouseleave", () => {

        heroButton.classList.remove("hero-btn-hover");

    });

}


/* =====================================================
   05. MEMBERSHIP CARD INTERACTION
===================================================== */

const membershipCards = document.querySelectorAll(
    ".membership-card"
);


membershipCards.forEach(card => {

    card.addEventListener("mouseenter", () => {

        membershipCards.forEach(otherCard => {

            otherCard.classList.remove("plan-active");

        });

        card.classList.add("plan-active");

    });


    card.addEventListener("mouseleave", () => {

        card.classList.remove("plan-active");

    });

});


/* =====================================================
   06. EXTERNAL IMAGE ERROR HANDLING
===================================================== */

const images = document.querySelectorAll(
    ".hero-bg-image, .passion-card img, .trainer-image img"
);


images.forEach(image => {

    if (image.complete && image.naturalWidth === 0) {

        image.classList.add("image-load-error");

    }

});


/* =====================================================
   08. HOME PAGE USER GREETING & PERSONALIZATION
===================================================== */

function updateHomeUserState() {
    let currentUser = null;
    try {
        const stored = localStorage.getItem("stacklyCurrentUser") || sessionStorage.getItem("stacklyCurrentUser");
        if (stored) {
            currentUser = JSON.parse(stored);
        }
    } catch (e) {
        console.error("Unable to read current user:", e);
    }

    const heroSmallTitle = document.querySelector(".hero-small-title");
    const heroContent = document.querySelector(".hero-content");
    let welcomeBanner = document.getElementById("heroWelcomeUser");

    if (currentUser && currentUser.name) {
        if (heroSmallTitle) {
            heroSmallTitle.innerHTML = `WELCOME BACK, <span class="hero-user-glow">${currentUser.name.toUpperCase()}</span>!`;
        }

        if (heroContent) {
            const heading = heroContent.querySelector("h1");
            if (!welcomeBanner) {
                welcomeBanner = document.createElement("div");
                welcomeBanner.id = "heroWelcomeUser";
                welcomeBanner.className = "hero-welcome-user-banner";
                if (heading) {
                    heroContent.insertBefore(welcomeBanner, heading);
                } else {
                    heroContent.prepend(welcomeBanner);
                }
            }
            welcomeBanner.innerHTML = `
                <div class="welcome-user-chip">
                    <span class="welcome-icon">⚡</span>
                    <span>Ready for your workout, <strong>${currentUser.name}</strong>?</span>
                </div>
            `;
        }
    } else {
        if (heroSmallTitle) {
            heroSmallTitle.textContent = "WELCOME TO STACKLY FITNESS";
        }
        if (welcomeBanner) {
            welcomeBanner.remove();
        }
    }
}

window.updateHomeUserState = updateHomeUserState;
updateHomeUserState();

/* =====================================================
   07. CONSOLE
===================================================== */

console.log(
    "STACKLY Fitness Home Page Initialized Successfully"
);


});
