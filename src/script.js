// Set current year
const yearEl = document.querySelector(".copyright-date");
const currentYear = new Date().getFullYear();
yearEl.textContent = currentYear;

// Form date validations
const currentDate = new Date();
const currentDateFormattedToArray = new Intl.DateTimeFormat("en-US")
  .format(currentDate)
  .split("/");
const currentDateFormatted = [
  currentDateFormattedToArray[2],
  currentDateFormattedToArray[0],
  currentDateFormattedToArray[1],
].join("-");

const maxDate = [
  currentDateFormattedToArray[2],
  increaseMonthBy2(currentDateFormattedToArray[0]),
  addAZero(currentDateFormattedToArray[1]),
].join("-");

const minDate = [
  currentDateFormattedToArray[2],
  addAZero(currentDateFormattedToArray[0]),
  addAZero(currentDateFormattedToArray[1]),
].join("-");

const formDate = document.querySelector('input[name="date"]');

console.log("min date for appt: " + minDate);
formDate.setAttribute("min", minDate);

console.log("max date for appt: " + maxDate);
formDate.setAttribute("max", maxDate);

function increaseMonthBy2(month) {
  let currentMonth = parseInt(month);
  let increasedMonth;
  if (currentMonth === 12) {
    increasedMonth = 2;
  } else {
    increasedMonth = currentMonth + 2;

    if (increasedMonth > 12) {
      increasedMonth = 1;
    }
  }

  increasedMonth = addAZero(increasedMonth);
  return increasedMonth.toString();
}

function addAZero(dateValue) {
  let dayOrMonth = parseInt(dateValue);
  if (dayOrMonth <= 9) {
    dayOrMonth = 0 + dayOrMonth.toString();
  }
  return dayOrMonth;
}

// Make mobile navigation work
const btnNavEl = document.querySelector(".btn-mobile-nav");
const headerEl = document.querySelector(".header");

btnNavEl.addEventListener("click", function () {
  headerEl.classList.toggle("nav-open");
});

// Smooth scrolling animation
/// for the browsers that can't use scroll-behavior
const allLinks = document.querySelectorAll("a:link");
allLinks.forEach(function (link) {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const href = link.getAttribute("href");

    // Scroll back to top
    if (href === "#")
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    // Scroll to other links
    if (href !== "#" && href.startsWith("#")) {
      const sectionEl = document.querySelector(href);
      sectionEl.scrollIntoView({ behavior: "smooth" });
    }
    // Close mobile nav
    if (link.classList.contains("main-nav-link"))
      headerEl.classList.toggle("nav-open");
  });
});

// // Sticky navigation
const scrollWatcher = document.createElement("div");
headerEl.before(scrollWatcher);

const obs = new IntersectionObserver(function (entries) {
  document.body.classList.toggle("sticky", !entries[0].isIntersecting);
});
obs.observe(scrollWatcher);

// FAQs Section, collapsible elements

const accordion = document.getElementsByClassName("item");

for (i = 0; i < accordion.length; i++) {
  accordion[i].addEventListener("click", function () {
    this.classList.toggle("active-content");
  });
}

// Form

const multiStepForm = document.querySelector("[data-multi-step");
const formScreens = [...multiStepForm.querySelectorAll("[data-step]")];
const statusSteps = [...document.getElementsByClassName("cta-status-step")];

let currentStep = formScreens.findIndex((step) => {
  return step.classList.contains("active");
});

if (currentStep < 0) {
  currentStep = 0;
  showCurrentStep();
  showCurrentStatusStep();
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
  const allValid = inputs.every((input) => input.reportValidity());

  console.log(allValid);

  if (allValid) {
    currentStep += incrementor;
    showCurrentStep();
    showCurrentStatusStep();
  }

  console.log(currentStep);
});

formScreens.forEach((step) => {
  step.addEventListener("animationend", (e) => {
    formScreens[currentStep].classList.remove("hide");
    e.target.classList.toggle("hide", !e.target.classList.contains("active"));
  });
});

function showCurrentStep() {
  formScreens.forEach((step, index) => {
    step.classList.toggle("active", index === currentStep);
  });
}

function showCurrentStatusStep() {
  statusSteps.forEach((status, index) => {
    status.classList.toggle("active-step", index <= currentStep);
  });
}
