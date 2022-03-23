// Set current year
const yearEl = document.querySelector(".copyright-date");
const currentYear = new Date().getFullYear();
yearEl.textContent = currentYear;


// Make mobile navigation work
const btnNavEl  = document.querySelector(".btn-mobile-nav");
const headerEl = document.querySelector(".header");

btnNavEl.addEventListener('click', function() {
    headerEl.classList.toggle('nav-open');
}) ;

// Smooth scrolling animation
/// for the browsers that can't use scroll-behavior
const allLinks = document.querySelectorAll("a:link");
allLinks.forEach(function(link){
    link.addEventListener('click', function(e){
        e.preventDefault();
        const href = link.getAttribute('href');

        // Scroll back to top
        if (href === "#") window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        // Scroll to other links
        if (href !== '#' && href.startsWith('#')){
            const sectionEl = document.querySelector(href);
            sectionEl.scrollIntoView({behavior:"smooth"});
        }
        // Close mobile nav
        if(link.classList.contains('main-nav-link'))
            headerEl.classList.toggle("nav-open");

    });
});

// Sticky navigation
const sectionHeroEl = document.querySelector(".section-hero");
const obs = new IntersectionObserver(function(entries){
    const ent = entries[0]; 
    console.log(ent);
    if(ent.isIntersecting === false){
        document.body.classList.add('sticky');
    }

    if(ent.isIntersecting){
        document.body.classList.remove('sticky');
    }
}, {
    // In the viewport
    root: null,
    threshold: 0,
    rootMargin: "-80px",
});
obs.observe(sectionHeroEl);


// FAQs Section, collapsible elements

const accordion = document.getElementsByClassName("item");

for (i=0; i<accordion.length; i++ ) {
    accordion[i].addEventListener('click', function(){
        this.classList.toggle('active-content');
    });
    };
