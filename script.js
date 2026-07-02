// Paste your Formspree endpoint here (e.g. "https://formspree.io/f/abcdwxyz").
// While empty, the form falls back to opening the visitor's mail app.
const FORM_ENDPOINT = "https://formspree.io/f/mqevyjeo";
const CONTACT_EMAIL = "ematos@matosdistribution.com";

// WhatsApp number, digits only with country code (e.g. "17875551234").
// While empty, all WhatsApp buttons stay hidden.
const WHATSAPP_NUMBER = "17874791188";

const IS_ES = document.documentElement.lang === "es";

// UI strings for both languages
const T = IS_ES
  ? {
      whatsappMessage: "¡Hola! Me interesa una máquina de vending para mi local.",
      invalidEmail: "Por favor ingresa un correo electrónico válido.",
      openingMail: "Abriendo tu aplicación de correo…",
      mailSubject: "Interés en máquina de vending — ",
      sending: "Enviando…",
      thanks: "Gracias — te contactaremos pronto.",
      error: `Algo salió mal. Escríbenos directamente a ${CONTACT_EMAIL}.`,
    }
  : {
      whatsappMessage: "Hi! I'm interested in a vending machine for my venue.",
      invalidEmail: "Please enter a valid email address.",
      openingMail: "Opening your email app…",
      mailSubject: "Vending machine inquiry — ",
      sending: "Sending…",
      thanks: "Thanks — we'll be in touch soon.",
      error: `Something went wrong. Email us directly at ${CONTACT_EMAIL}.`,
    };

// --- WhatsApp buttons ---
if (WHATSAPP_NUMBER) {
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(T.whatsappMessage)}`;
  document.querySelectorAll("[data-whatsapp]").forEach((a) => (a.href = waUrl));
  document.querySelectorAll("[data-whatsapp-ui]").forEach((el) => el.classList.add("is-active"));
}

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

  // Honeypot: real users never see this field; bots fill it
  if (form.company && form.company.value) {
    status.textContent = T.thanks;
    form.reset();
    return;
  }

  const email = form.email.value.trim();
  if (!email || !form.email.checkValidity()) {
    status.textContent = T.invalidEmail;
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
    const subject = encodeURIComponent(T.mailSubject + [data.firstName, data.lastName].filter(Boolean).join(" "));
    const body = encodeURIComponent(
      `Name: ${data.firstName} ${data.lastName}\nEmail: ${data.email}\n\n${data.message}`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    status.textContent = T.openingMail;
    return;
  }

  const button = form.querySelector("button[type=submit]");
  button.disabled = true;
  status.textContent = T.sending;

  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Request failed");
    form.reset();
    status.textContent = T.thanks;
  } catch {
    status.textContent = T.error;
  } finally {
    button.disabled = false;
  }
});
