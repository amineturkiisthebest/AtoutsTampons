(() => {
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  const layout = document.querySelector(".layout");
  const filterToggle = document.querySelector(".filter-toggle");
  const cartLink = document.querySelector(".cart-link");
  const cartCount = document.querySelector(".cart-count");
  const toast = document.querySelector(".toast");

  // Header background once the page is scrolled
  if (header) {
    const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  // Mobile menu
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Header search bar
  const searchButton = document.querySelector(".search-button");
  const searchForm = document.querySelector(".header-search");
  if (searchButton && searchForm) {
    const searchInput = searchForm.querySelector("input");
    const setSearch = (open) => {
      searchForm.hidden = !open;
      searchButton.setAttribute("aria-expanded", String(open));
      if (open) searchInput.focus();
      else searchButton.focus();
    };

    searchButton.addEventListener("click", () => setSearch(true));
    searchForm.querySelector(".header-search__close").addEventListener("click", () => setSearch(false));
    searchForm.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setSearch(false);
    });
    document.addEventListener("click", (event) => {
      if (!searchForm.hidden && !searchForm.contains(event.target) && !searchButton.contains(event.target)) {
        searchForm.hidden = true;
        searchButton.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Show / hide the category sidebar
  if (filterToggle && layout) {
    filterToggle.addEventListener("click", () => {
      const hidden = layout.classList.toggle("filters-hidden");
      filterToggle.setAttribute("aria-expanded", String(!hidden));
      filterToggle.setAttribute("aria-label", hidden ? "Afficher les filtres" : "Masquer les filtres");
    });
  }

  // Highlight the selected category
  document.querySelectorAll(".filters li").forEach((item) => {
    item.addEventListener("click", (event) => {
      event.preventDefault();
      const wasActive = item.classList.contains("is-active");
      document.querySelectorAll(".filters li.is-active").forEach((li) => li.classList.remove("is-active"));
      item.classList.toggle("is-active", !wasActive);
    });
  });

  // Toast notifications
  let toastTimer;
  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
  };

  // Wishlist
  document.querySelectorAll(".wishlist-button").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const active = button.getAttribute("aria-pressed") !== "true";
      const icon = button.querySelector("i");
      button.setAttribute("aria-pressed", String(active));
      button.setAttribute("aria-label", active ? "Retirer des favoris" : "Ajouter aux favoris");
      icon.classList.toggle("fa-solid", active);
      icon.classList.toggle("fa-regular", !active);
      showToast(active ? "Ajouté aux favoris" : "Retiré des favoris");
    });
  });

  // Add to cart
  let cartTotal = 0;
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const name = button.closest(".product-card").querySelector("h3").textContent.trim();
      cartTotal += 1;

      if (cartCount) {
        cartCount.textContent = cartTotal;
        cartCount.hidden = false;
      }

      if (cartLink) {
        cartLink.classList.remove("bump");
        void cartLink.offsetWidth; // restart the animation
        cartLink.classList.add("bump");
      }

      showToast(`« ${name} » ajouté au panier`);
    });
  });

  // Fade sections in as they scroll into view
  const revealTargets = document.querySelectorAll(
    ".section-intro, .brand-tile, .partnership, .news article, .product-card, .manufacturing"
  );

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealTargets.forEach((element) => {
      element.classList.add("reveal");
      // Drop the reveal classes afterwards so hover transforms work again
      element.addEventListener(
        "transitionend",
        () => element.classList.remove("reveal", "is-visible"),
        { once: true }
      );
      observer.observe(element);
    });
  }
})();
