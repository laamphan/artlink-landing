// Change Navbar Style when scrolled
const navbar = document.querySelector(".nav-bar");
window.onscroll = () => {
  if (window.scrollY > 10) {
    navbar.classList.add("nav-bar-scrolled");
  } else {
    navbar.classList.remove("nav-bar-scrolled");
  }
};

// Reset Navbar when window resized
window.onresize = () => {
  if (window.innerWidth < 1240) {
    closeMobileNavbar();
  }
};

// Toggle Mobile Navigation Bar
function toggleMobileNavbar() {
  console.log("toggle");
  // Expand mobile navigation
  let x = document.getElementsByClassName("nav-expand");
  if (x[0].classList.contains("nav-expanded")) {
    x[0].classList.remove("nav-expanded");
  } else {
    x[0].classList.add("nav-expanded");
  }

  // Overlay to close Nav when click out
  let y = document.getElementsByClassName("js-overlay-nav-close");
  let z = y[0];
  if (z.classList.contains("z-m1")) {
    z.classList.remove("z-m1");
    z.classList.add("z-100");
  } else {
    z.classList.add("z-m1");
    z.classList.remove("z-100");
  }
}

function closeMobileNavbar() {
  let x = document.getElementsByClassName("nav-expand");
  x[0].classList.remove("nav-expanded");

  // Overlay to close Nav when click out
  let y = document.getElementsByClassName("js-overlay-nav-close");
  let z = y[0];
  if (z.classList.contains("z-100")) {
    z.classList.add("z--1");
    z.classList.remove("z-100");
  }
}

// Toggle Dropdown and hide others
function toggleDropdown(el) {
  x = el.parentElement;
  if (!x.classList.contains("active")) {
    for (let i = 0; i < x.parentElement.children.length; i++) {
      if (x.parentElement.children[i].classList.contains("active")) {
        x.parentElement.children[i].classList.remove("active");
      }
    }
    x.classList.add("active");
  } else {
    x.classList.remove("active");
  }
}

// Collapse all dropdowns
function collapseDropdowns() {
  x = document.getElementsByClassName("nav-items");
  for (let i = 0; i < x[0].children.length; i++) {
    x[0].children[i].classList.remove("active");
  }
}

function toggleCloseNavOverlay() {
  let y = document.getElementsByClassName("js-overlay-nav-close");
  let z = y[0];
  if (z.classList.contains("z--1")) {
    z.classList.remove("z--1");
    z.classList.add("z-100");
  }
}

// Carousel

// DOM utility functions:

const el = (sel, par) => (par || document).querySelector(sel);
const els = (sel, par) => (par || document).querySelectorAll(sel);
const elNew = (tag, prop) => Object.assign(document.createElement(tag), prop);

// Helper functions:
const mod = (n, m) => ((n % m) + m) % m;

// Carousel:

const carousel = (elCarousel) => {
  const animation = 500;
  const pause = 3000;

  const elCarouselSlider = el(".carousel-items", elCarousel);
  const elsSlides = els(".carousel-item", elCarouselSlider);
  const elsBtns = [];
  const elsPrevNext = [];

  let itv; // Autoslide interval
  let tot = elsSlides.length; // Total slides
  let c = 0;

  let dragPos = 0;
  let prevPos = 0;
  let calc = 0;
  let x = 0;

  if (tot < 2) return; // Not enough slides. Do nothing.

  // Methods:
  const anim = (ms = animation) => {
    const cMod = mod(c, tot);
    // Move slider
    elCarouselSlider.style.transitionDuration = `${ms}ms`;

    // Carousel hero
    if (tot > 3) {
      if (window.matchMedia("only screen and (min-width: 1240px)").matches) {
        elCarouselSlider.style.transform = `translateX(${
          (((-c - 1) * 100) / (tot + 2) / 3) * 2
        }%)`;
      } else {
        elCarouselSlider.style.transform = `translateX(${
          ((-c - 1) * 100) / (tot + 2)
        }%)`;
      }
    }
    // Carousel Members
    else if (tot === 3) {
      elCarouselSlider.style.transform = `translateX(${
        // (((-c - 1) * 100) / (tot + 2) / 5) * 2
        ((-c - 1) * 100) / (tot + 4)
      }%)`;
    }
    // Carousel of 2 items
    else {
      elCarouselSlider.style.transform = `translateX(${
        ((-c - 1) * 100) / (tot + 2)
      }%)`;
    }
    // Handle active classes (slide and bullet)
    elsSlides.forEach((elSlide, i) =>
      elSlide.classList.toggle("is-active", cMod === i)
    );
    elsBtns.forEach((elBtn, i) =>
      elBtn.classList.toggle("is-active", cMod === i)
    );
  };

  const prev = () => {
    if (c <= -1) return; // prevent blanks on fast prev-click
    c -= 1;
    anim();
  };

  const next = () => {
    if (c >= tot) return; // prevent blanks on fast next-click
    c += 1;
    anim();
  };

  const goto = (index) => {
    c = index;
    anim();
    // Autoslide;
  };

  const play = () => {
    itv = setInterval(next, pause + animation);
  };

  const stop = () => {
    clearInterval(itv);
  };

  const drag = (e) => {
    if (e.type === "touchmove") {
      calc = (e.touches[0].clientX - x) / 1;
    } else {
      calc = (e.clientX - x) / 1;
    }

    dragPos = calc + prevPos;
    calc = 0;
  };

  const handleDragEnd = () => {
    if (dragPos < prevPos) {
      next();
    } else if (dragPos > prevPos) {
      prev();
    }

    console.log(x, dragPos, prevPos);
    elCarouselSlider.removeEventListener("touchmove", drag);
    elCarouselSlider.removeEventListener("mousemove", drag);
    dragPos = 0;
    prevPos = 0;
  };

  // Buttons:

  const elPrev = elNew("button", {
    type: "button",
    className: "carousel-prev avatar avatar-tiny cursor-pointer",
    innerHTML: "<span></span>",
    onclick: () => prev(),
  });

  const elNext = elNew("button", {
    type: "button",
    className: "carousel-next avatar avatar-tiny cursor-pointer",
    innerHTML: "<span></span>",
    onclick: () => next(),
  });

  // Navigation:

  const elPrevNext = elNew("div", {
    className: "carousel-prev-next",
  });

  const elNavigation = elNew("div", {
    className: "carousel-navigation",
  });

  // Navigation bullets:

  for (let i = 0; i < tot; i++) {
    const elBtn = elNew("button", {
      type: "button",
      className: "carousel-bullet",
      onclick: () => goto(i),
    });
    elsBtns.push(elBtn);
  }

  // Events:

  // Infinite slide effect:
  elCarouselSlider.addEventListener("transitionend", () => {
    if (c <= -1) c = tot - 1;
    if (c >= tot) c = 0;
    anim(0); // quickly switch to "c" slide (with animation duration 0)
  });

  elCarouselSlider.addEventListener("mousedown", (e) => {
    x = e.clientX;

    elCarouselSlider.addEventListener("mousemove", drag);

    prevPos += calc;
  });

  elCarouselSlider.addEventListener("touchstart", (e) => {
    x = e.touches[0].clientX;

    elCarouselSlider.addEventListener("touchmove", drag);

    prevPos += calc;
  });

  elCarouselSlider.addEventListener("mouseup", handleDragEnd);
  elCarouselSlider.addEventListener("touchend", handleDragEnd);

  // Pause on pointer enter:
  elCarousel.addEventListener("pointerenter", () => stop());
  elCarousel.addEventListener("pointerleave", () => play());

  // Quickly reposition carousel when screen size changes
  window.addEventListener("resize", () => anim(0));

  // Init:

  // Insert UI elements:
  elNavigation.append(...elsBtns);
  elsPrevNext.push(elPrev, elNext);
  elPrevNext.append(...elsPrevNext);
  elCarousel.append(elNavigation);
  elCarousel.append(elPrevNext);

  // Clone first and last slides (for "infinite" slider effect)
  elCarouselSlider.prepend(elsSlides[tot - 1].cloneNode(true));
  elCarouselSlider.append(elsSlides[0].cloneNode(true));

  if (tot === 3) {
    elCarouselSlider.prepend(elsSlides[tot - 2].cloneNode(true));
    elCarouselSlider.append(elsSlides[1].cloneNode(true));
  }

  // Initial slide
  anim();

  // Start autoplay
  play();
};

// Allows to use multiple carousels on the same page:
els(".carousel").forEach(carousel);
