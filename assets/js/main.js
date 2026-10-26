(function () {
  "use strict";

  var root = document.documentElement;
  var appearanceKey = "appearance";

  function readStorage(storage, key) {
    try {
      return storage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function writeStorage(storage, key, value) {
    try {
      storage.setItem(key, value);
    } catch (error) {}
  }

  function updateThemeControls() {
    var isDark = root.classList.contains("dark");

    document.querySelectorAll("[data-theme-toggle]").forEach(function (button) {
      button.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode",
      );
      button.setAttribute(
        "title",
        isDark ? "Switch to light mode" : "Switch to dark mode",
      );
    });
  }

  function applyAppearance(appearance) {
    root.classList.toggle("dark", appearance === "dark");
    root.style.colorScheme = appearance === "dark" ? "dark" : "light";
    writeStorage(localStorage, appearanceKey, appearance);
    updateThemeControls();
  }

  var storedAppearance = readStorage(localStorage, appearanceKey);

  applyAppearance(storedAppearance === "light" ? "light" : "dark");

  document.querySelectorAll("[data-theme-toggle]").forEach(function (button) {
    button.addEventListener("click", function () {
      applyAppearance(root.classList.contains("dark") ? "light" : "dark");
    });
  });

  document.querySelectorAll("[data-promo-dismiss]").forEach(function (button) {
    var promo = button.closest(".site-promo");

    if (!promo) {
      return;
    }

    if (readStorage(sessionStorage, "promo-dismissed") === "1") {
      promo.remove();

      return;
    }

    button.addEventListener("click", function () {
      writeStorage(sessionStorage, "promo-dismissed", "1");
      promo.remove();
    });
  });

  var menuToggle = document.querySelector("[data-menu-toggle]");
  var mobileNav = document.getElementById("mobile-navigation");

  if (menuToggle && mobileNav) {
    var setMenuOpen = function (open) {
      mobileNav.classList.toggle("open", open);
      menuToggle.setAttribute("aria-expanded", String(open));
    };

    menuToggle.addEventListener("click", function () {
      setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setMenuOpen(false);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    });
  }

  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll(".site-nav a[href^='#']"),
  );

  var navSections = navLinks
    .map(function (link) {
      return document.querySelector(link.getAttribute("href"));
    })
    .filter(Boolean);

  function updateActiveNav() {
    var position = window.scrollY + 140;
    var currentId = "";

    navSections.forEach(function (section) {
      if (
        position >= section.offsetTop &&
        position < section.offsetTop + section.offsetHeight
      ) {
        currentId = section.id;
      }
    });

    navLinks.forEach(function (link) {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === "#" + currentId,
      );
    });
  }

  if (navLinks.length) {
    window.addEventListener("scroll", updateActiveNav, { passive: true });
    window.addEventListener("load", updateActiveNav);
    updateActiveNav();
  }

  var scrollTop = document.querySelector(".scroll-top");

  if (scrollTop) {
    var toggleScrollTop = function () {
      scrollTop.classList.toggle("active", window.scrollY > 200);
    };

    scrollTop.addEventListener("click", function (event) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    window.addEventListener("scroll", toggleScrollTop, { passive: true });
    window.addEventListener("load", toggleScrollTop);
    toggleScrollTop();
  }

  if (window.AOS) {
    window.AOS.init({
      duration: 600,
      easing: "ease-out",
      once: true,
      mirror: false,
    });
  }

  var typedElement = document.querySelector(".typed");

  if (typedElement && window.Typed) {
    var typedItems = (typedElement.getAttribute("data-typed-items") || "")
      .split(",")
      .map(function (item) {
        return item.trim();
      })
      .filter(Boolean);

    if (typedItems.length) {
      new window.Typed(typedElement, {
        strings: typedItems,
        loop: true,
        typeSpeed: 90,
        backSpeed: 45,
        backDelay: 2200,
      });
    }
  }

  var contactForm = document.querySelector(".contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      var formData = new FormData(contactForm);
      var name = String(formData.get("name") || "");
      var email = String(formData.get("email") || "");
      var subject = String(formData.get("subject") || "Portfolio enquiry");
      var message = String(formData.get("message") || "");
      var body =
        "Name: " +
        name +
        "\nEmail: " +
        email +
        "\n\n" +
        message;

      var sentMessage = contactForm.querySelector(".sent-message");
      var errorMessage = contactForm.querySelector(".error-message");

      if (errorMessage) {
        errorMessage.classList.remove("d-block");
      }

      if (sentMessage) {
        sentMessage.classList.add("d-block");
      }

      window.location.href =
        "mailto:couresma@gmail.com?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(body);

      contactForm.reset();
    });
  }

  var yearElement = document.getElementById("year");

  if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
  }
})();
