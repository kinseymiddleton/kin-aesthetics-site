/* Kin-Aesthetics — minor interactions */

// Scroll reveal
const revealEls = document.querySelectorAll(
  ".display, .h2, .lede, .svc, .pill, .faq-item, .stat, .beliefs-list li, .r-row, .photo-frame, .photo-meta, .contact-card, .about-card, .diff-card, .eyebrow, .hero-stats"
);
revealEls.forEach((el) => el.classList.add("reveal"));

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);
revealEls.forEach((el) => io.observe(el));

// Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const siteNav = document.getElementById("siteNav");
if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const open = siteNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", open);
    navToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });
  // Close nav when a link is clicked
  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open navigation");
    });
  });
  // Close nav on outside click
  document.addEventListener("click", (e) => {
    if (!siteNav.contains(e.target) && !navToggle.contains(e.target)) {
      siteNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open navigation");
    }
  });
}

// Single-open accordion behaviour (FAQ)
const faqs = document.querySelectorAll(".faq-item");
faqs.forEach((item) => {
  item.addEventListener("toggle", () => {
    if (item.open) {
      faqs.forEach((other) => {
        if (other !== item) other.open = false;
      });
    }
  });
});

// Contact form — Netlify Forms AJAX submission
const form = document.getElementById("inquiryForm");
const note = document.getElementById("formNote");
const submitBtn = document.getElementById("submitBtn");
const formSuccess = document.getElementById("formSuccess");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const first = (data.get("first") || "").toString().trim();
    const email = (data.get("email") || "").toString().trim();

    if (!first || !email) {
      note.textContent = "A first name and email is plenty to start.";
      note.style.color = "#B45A3C";
      return;
    }

    note.style.color = "";
    note.textContent = "";
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";

    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data).toString(),
      });

      if (res.ok) {
        submitBtn.textContent = "Sent";
        setTimeout(() => {
          form.hidden = true;
          formSuccess.hidden = false;
        }, 700);
      } else {
        throw new Error(res.status);
      }
    } catch {
      note.textContent = "Something went wrong — please email us directly at kinaestheticmarketing@gmail.com.";
      note.style.color = "#B45A3C";
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Send <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
    }
  });
}

// Header shadow on scroll
const header = document.querySelector(".site-header");
const updateHeader = () => {
  if (window.scrollY > 8) {
    header.style.boxShadow = "0 1px 0 rgba(40,30,15,.06), 0 20px 40px -30px rgba(40,30,15,.18)";
  } else {
    header.style.boxShadow = "none";
  }
};
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });
