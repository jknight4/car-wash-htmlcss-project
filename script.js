// Set current year
const yearEl = document.querySelector(".copyright-date");
const currentYear = new Date().getFullYear();
yearEl.textContent = currentYear;


// Make mobile navigation work
const btnNavEl = document.querySelector(".btn-mobile-nav");
const headerEl = document.querySelector(".header");

btnNavEl.addEventListener('click', function () {
    headerEl.classList.toggle('nav-open');
});

// Smooth scrolling animation
/// for the browsers that can't use scroll-behavior
const allLinks = document.querySelectorAll("a:link");
allLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const href = link.getAttribute('href');

        // Scroll back to top
        if (href === "#") window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        // Scroll to other links
        if (href !== '#' && href.startsWith('#')) {
            const sectionEl = document.querySelector(href);
            sectionEl.scrollIntoView({ behavior: "smooth" });
        }
        // Close mobile nav
        if (link.classList.contains('main-nav-link'))
            headerEl.classList.toggle("nav-open");

    });
});

// // Sticky navigation
const scrollWatcher = document.createElement("div");
headerEl.before(scrollWatcher);

const obs = new IntersectionObserver(function (entries) {

    document.body.classList.toggle('sticky', !entries[0].isIntersecting);


});
obs.observe(scrollWatcher);


// FAQs Section, collapsible elements

const accordion = document.getElementsByClassName("item");

for (i = 0; i < accordion.length; i++) {
    accordion[i].addEventListener('click', function () {
        this.classList.toggle('active-content');
    });
};


// Form

const multiStepForm = document.querySelector("[data-multi-step");
const formScreens = [...multiStepForm.querySelectorAll("[data-step]")];

let currentStep = formScreens.findIndex((step) => {
    return step.classList.contains("active");
});

if (currentStep < 0) {
    currentStep = 0;
    showCurrentStep();
}

multiStepForm.addEventListener("click", (e) => {
    let incrementor;
    if (e.target.matches("[data-next]")) {
        incrementor = 1;
    } else if (e.target.matches("[data-back]")) {
        incrementor = -1;
    }

    if (incrementor == null) return;

    const inputs = [...formScreens[currentStep].querySelectorAll("input")];
    const allValid = inputs.every(input => input.reportValidity());

    console.log(allValid);

    if (allValid) {
        currentStep += incrementor;
        showCurrentStep();
    }

    console.log(currentStep);
});


formScreens.forEach(step => {
    step.addEventListener("animationend", e => {
        formScreens[currentStep].classList.remove("hide");
        e.target.classList.toggle("hide", !e.target.classList.contains("active"))
    })
})

function showCurrentStep() {
    formScreens.forEach((step, index) => {
        step.classList.toggle("active", index === currentStep);
    })
}