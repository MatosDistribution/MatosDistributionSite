// Paste your Formspree endpoint here (e.g. "https://formspree.io/f/abcdwxyz").
// While empty, the form falls back to opening the visitor's mail app.
const FORM_ENDPOINT = "https://formspree.io/f/mqevyjeo";
const CONTACT_EMAIL = "ematos@matosdistribution.com";

// --- Mobile nav ---
const toggle = document.querySelector(".nav-toggle");
const menu = document.querySelector(".nav-links");

toggle.addEventListener("click", () => {
  const open = menu.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", String(open));
});

menu.addEventListener("click", (e) => {
  if (e.target.matches("a")) {
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }
});

// --- Scroll reveal ---
const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// --- Contact form ---
const form = document.getElementById("contact-form");
const status = form.querySelector(".form-status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = form.email.value.trim();
  if (!email || !form.email.checkValidity()) {
    status.textContent = "Please enter a valid email address.";
    form.email.focus();
    return;
  }

  const data = {
    firstName: form.firstName.value.trim(),
    lastName: form.lastName.value.trim(),
    email,
    message: form.message.value.trim(),
  };

  if (!FORM_ENDPOINT) {
    // Mailto fallback until a Formspree endpoint is configured
    const subject = encodeURIComponent("Vending machine inquiry — " + [data.firstName, data.lastName].filter(Boolean).join(" "));
    const body = encodeURIComponent(
      `Name: ${data.firstName} ${data.lastName}\nEmail: ${data.email}\n\n${data.message}`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    status.textContent = "Opening your email app…";
    return;
  }

  const button = form.querySelector("button[type=submit]");
  button.disabled = true;
  status.textContent = "Sending…";

  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Request failed");
    form.reset();
    status.textContent = "Thanks — we'll be in touch soon.";
  } catch {
    status.textContent = `Something went wrong. Email us directly at ${CONTACT_EMAIL}.`;
  } finally {
    button.disabled = false;
  }
});
