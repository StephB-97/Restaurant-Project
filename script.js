/* =============================================
   1. FLOATING PAW PRINT BACKGROUND
   Creates random floating emoji spans and
   injects them into the #paw-bg container
============================================= */

function createPawBackground() {
  var container = document.getElementById("paw-bg");
  if(!container) return;
  var emojis = ["🐾", "🐾", "🐾", "🐕", "🦴", "❤️", "🐩"];
  var totalSpans = 20;

  for (var i = 0; i < totalSpans; i++) {
    var span = document.createElement("span");

    // Pick a random emoji
    var randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    span.textContent = randomEmoji;

    // Random horizontal position
    span.style.left = Math.random() * 100 + "%";

    // Random speed and delay so they don't all move together
    span.style.animationDuration = (10 + Math.random() * 10) + "s";
    span.style.animationDelay    = (Math.random() * 14) + "s";

    container.appendChild(span);
  }
}


/* =============================================
   2. NAVBAR - SHADOW ON SCROLL
   Adds a CSS class to the navbar once the
   user scrolls down more than 30px
============================================= */

function handleNavbarShadow() {
  var navbar = document.getElementById("navbar");

  if (window.scrollY > 30) {
    navbar.style.boxShadow = "0 4px 20px rgba(91, 154, 201, 0.18)";
  } else {
    navbar.style.boxShadow = "none";
  }
}


/* =============================================
   3. ACTIVE NAV LINK HIGHLIGHT
   Checks which section is currently in view
   and marks the matching nav link as active
============================================= */

function updateActiveNavLink() {
  var sections  = ["home", "menu", "gallery", "about", "contact"];
  var navLinks  = document.querySelectorAll(".nav-links a");
  var currentSection = "home";

  // Find the last section whose top is above the midpoint of the screen
  for (var i = 0; i < sections.length; i++) {
    var el = document.getElementById(sections[i]);

    if (el && window.scrollY >= el.offsetTop - 160) {
      currentSection = sections[i];
    }
  }

  // Toggle the active class on each link
  for (var j = 0; j < navLinks.length; j++) {
    var href = navLinks[j].getAttribute("href");

    if (href === "#" + currentSection) {
      navLinks[j].classList.add("active");
    } else {
      navLinks[j].classList.remove("active");
    }
  }
}


/* =============================================
   4. HAMBURGER MENU
   Toggles the mobile dropdown open/closed
   Called by onclick in the HTML
============================================= */

function toggleMenu() {
  var btn    = document.getElementById("hamburger-btn");
  var drawer = document.getElementById("mobile-menu");

  btn.classList.toggle("open");
  drawer.classList.toggle("open");
}

function closeMenu() {
  var btn    = document.getElementById("hamburger-btn");
  var drawer = document.getElementById("mobile-menu");

  btn.classList.remove("open");
  drawer.classList.remove("open");
}


/* =============================================
   5. MENU CATEGORY FILTER
   Shows only the cards matching the chosen
   category; "all" shows every card
   Called by onclick on the filter buttons
============================================= */

function filterMenu(category, clickedBtn) {
  // Update which button looks active
  var allButtons = document.querySelectorAll(".filter-btn");
  for (var i = 0; i < allButtons.length; i++) {
    allButtons[i].classList.remove("active");
  }
  clickedBtn.classList.add("active");

  // Show or hide each menu card
  var cards = document.querySelectorAll(".menu-card");
  for (var j = 0; j < cards.length; j++) {
    var cardCategory = cards[j].getAttribute("data-category");

    if (category === "all" || cardCategory === category) {
      cards[j].style.display = "block";
    } else {
      cards[j].style.display = "none";
    }
  }
}


/* =============================================
   6. GALLERY SLIDER
   Tracks which slide is current and moves the
   track using CSS transform: translateX
============================================= */

var currentSlide  = 0;
var totalSlides   = 6;
var sliderTimer   = null;  // used for auto-advance

// Move to a specific slide index
function goToSlide(index) {
  // Wrap around at the ends
  if (index < 0) {
    index = totalSlides - 1;
  }
  if (index >= totalSlides) {
    index = 0;
  }

  currentSlide = index;

  // Slide the track
  var track = document.getElementById("slider-track");
  track.style.transform = "translateX(-" + (currentSlide * 100) + "%)";

  // Update dot indicators
  updateDots();

  // Update thumbnail highlights
  updateThumbs();
}

// Move forward or backward by one slide
// direction: +1 (next) or -1 (prev)
function moveSlide(direction) {
  goToSlide(currentSlide + direction);
}

// Build the dot buttons and insert them into #slider-dots
function buildDots() {
  var container = document.getElementById("slider-dots");
  container.innerHTML = "";  // clear any existing dots

  for (var i = 0; i < totalSlides; i++) {
    var dot = document.createElement("button");
    dot.className = "dot";
    dot.setAttribute("data-index", i);

    // We need a closure to capture the correct i value
    dot.addEventListener("click", (function(slideIndex) {
      return function() {
        goToSlide(slideIndex);
      };
    })(i));

    container.appendChild(dot);
  }

  updateDots();
}

// Add/remove the active class from dots
function updateDots() {
  var dots = document.querySelectorAll(".dot");
  for (var i = 0; i < dots.length; i++) {
    if (i === currentSlide) {
      dots[i].classList.add("active");
    } else {
      dots[i].classList.remove("active");
    }
  }
}

// Add/remove the active class from thumbnails
function updateThumbs() {
  var thumbs = document.querySelectorAll(".thumb");
  for (var i = 0; i < thumbs.length; i++) {
    if (i === currentSlide) {
      thumbs[i].classList.add("active");
    } else {
      thumbs[i].classList.remove("active");
    }
  }
}


/* =============================================
   7. SLIDER AUTO-ADVANCE
   Moves to the next slide every 4.5 seconds.
   Pauses when the user hovers over the slider.
============================================= */

function startAutoSlide() {
  sliderTimer = setInterval(function() {
    moveSlide(1);
  }, 4500);
}

function stopAutoSlide() {
  clearInterval(sliderTimer);
}

function setupSliderHoverPause() {
  var container = document.querySelector(".slider-container");
  if (!container) return;

  container.addEventListener("mouseenter", stopAutoSlide);
  container.addEventListener("mouseleave", startAutoSlide);
}


/* =============================================
   8. SLIDER TOUCH / SWIPE SUPPORT
   Detects a finger swipe left or right and
   moves the slider accordingly
============================================= */

var touchStartX = 0;

function setupTouchSlider() {
  var track = document.getElementById("slider-track");
  if (!track) return;

  track.addEventListener("touchstart", function(e) {
    touchStartX = e.touches[0].clientX;
  });

  track.addEventListener("touchend", function(e) {
    var touchEndX = e.changedTouches[0].clientX;
    var difference = touchStartX - touchEndX;

    // Only register as a swipe if finger moved more than 50px
    if (difference > 50) {
      moveSlide(1);   // swiped left → next
    } else if (difference < -50) {
      moveSlide(-1);  // swiped right → prev
    }
  });
}


/* =============================================
   9. CONTACT FORM VALIDATION
   Checks that name, email and message fields
   are filled in correctly before "sending"
============================================= */

function submitForm(event) {
  // Stop the page from reloading (default form behaviour)
  event.preventDefault();

  var name    = document.getElementById("fname").value.trim();
  var email   = document.getElementById("femail").value.trim();
  var message = document.getElementById("fmessage").value.trim();

  var isValid = true;

  // --- Validate Name ---
  if (name === "") {
    document.getElementById("error-name").textContent = "Please enter your name.";
    document.getElementById("fname").style.borderColor = "#e00055";
    isValid = false;
  } else {
    document.getElementById("error-name").textContent = "";
    document.getElementById("fname").style.borderColor = "";
  }

  // --- Validate Email ---
  // A simple check: must contain @ and a dot after it
  var emailOk = email.includes("@") && email.includes(".");
  if (email === "" || !emailOk) {
    document.getElementById("error-email").textContent = "Please enter a valid email address.";
    document.getElementById("femail").style.borderColor = "#e00055";
    isValid = false;
  } else {
    document.getElementById("error-email").textContent = "";
    document.getElementById("femail").style.borderColor = "";
  }

  // --- Validate Message ---
  if (message === "") {
    document.getElementById("error-message").textContent = "Please write us a message.";
    document.getElementById("fmessage").style.borderColor = "#e00055";
    isValid = false;
  } else {
    document.getElementById("error-message").textContent = "";
    document.getElementById("fmessage").style.borderColor = "";
  }

  // --- If all fields are valid, show success ---
  if (isValid) {
    document.getElementById("contact-form").reset();

    var successBox = document.getElementById("form-success");
    successBox.style.display = "block";

    // Hide the success message after 6 seconds
    setTimeout(function() {
      successBox.style.display = "none";
    }, 6000);
  }
}


/* =============================================
   10. BACK-TO-TOP BUTTON
   Shows the button once the user scrolls
   down 300px; hides it near the top
============================================= */

function handleBackToTop() {
  var btn = document.getElementById("back-to-top");

  if (window.scrollY > 300) {
    btn.classList.add("show");
  } else {
    btn.classList.remove("show");
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}


/* =============================================
   SCROLL LISTENER
   Runs multiple functions each time the user
   scrolls the page
============================================= */

window.addEventListener("scroll", function() {
  handleNavbarShadow();
  updateActiveNavLink();
  handleBackToTop();
});


/* =============================================
   PAGE LOAD
   Runs once when the page is fully loaded.
   This is where we kick everything off.
============================================= */

window.onload = function() {
  createPawBackground();
  buildDots();
  goToSlide(0);
  startAutoSlide();
  setupSliderHoverPause();
  setupTouchSlider();

  // Run once on load so the first section is already highlighted
  updateActiveNavLink();
};
