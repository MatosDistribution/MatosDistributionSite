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
  document.querySelectorAll("[data-whatsapp]").forEach((a) => {
    a.href = waUrl;
    a.target = "_blank";
    a.rel = "noopener";
  });
  document.querySelectorAll("[data-whatsapp-ui]").forEach((el) => el.classList.add("is-active"));

  // On phones the nav CTA goes straight to WhatsApp; on desktop it scrolls to the form
  if (window.matchMedia("(max-width: 620px)").matches) {
    document.querySelectorAll(".nav-cta").forEach((a) => {
      a.href = waUrl;
      a.target = "_blank";
      a.rel = "noopener";
    });
  }
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

// --- Scroll reveal (staggered: elements entering together cascade in) ---
const observer = new IntersectionObserver(
  (entries) => {
    let delay = 0;
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = `${delay}ms`;
        delay = Math.min(delay + 90, 450);
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// --- Count-up stats (fact-list values like "100%" and "$0") ---
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const statObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      statObserver.unobserve(entry.target);
      const match = entry.target.textContent.trim().match(/^(\$?)(\d+)(.*)$/);
      if (!match || reducedMotion) continue;
      const [, prefix, num, suffix] = match;
      const target = parseInt(num, 10);
      const start = performance.now();
      const duration = 1100;
      const tick = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        entry.target.textContent = prefix + Math.round(target * eased) + suffix;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  },
  { threshold: 0.6 }
);

document.querySelectorAll(".fact-list strong").forEach((el) => statObserver.observe(el));

// --- Subtle scroll parallax ---
const parallaxEls = document.querySelectorAll("[data-parallax]");
if (parallaxEls.length && !reducedMotion) {
  let ticking = false;
  const apply = () => {
    const vh = window.innerHeight;
    for (const el of parallaxEls) {
      const r = el.getBoundingClientRect();
      const progress = (r.top + r.height / 2 - vh / 2) / vh; // ~ -0.5..0.5 across the viewport
      const strength = parseFloat(el.dataset.parallax) || 20;
      el.style.transform = `translate3d(0, ${(-progress * strength).toFixed(1)}px, 0)`;
    }
    ticking = false;
  };
  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(apply);
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  apply();
}

// --- Revenue estimator ---
const estNights = document.getElementById("est-nights");
if (estNights) {
  const estGuests = document.getElementById("est-guests");
  const nightsVal = document.getElementById("est-nights-val");
  const guestsVal = document.getElementById("est-guests-val");
  const barOut = document.getElementById("est-bar");
  const machineOut = document.getElementById("est-machine");

  // Assumptions (see revenue estimator notes)
  const CONVERSION = 0.025; // share of guests who buy from the machine
  const AVG_TICKET = 13.5; // average machine purchase
  const DRINK_VALUE = 10; // value of one retained drink sale
  const WEEKS_PER_MONTH = 4.33;

  const money = (n) => {
    const rounded = n >= 1000 ? Math.round(n / 50) * 50 : Math.round(n / 10) * 10;
    return "$" + rounded.toLocaleString("en-US");
  };

  const update = () => {
    const nights = +estNights.value;
    const guests = +estGuests.value;
    nightsVal.textContent = nights;
    guestsVal.textContent = guests.toLocaleString("en-US");
    const buyersPerMonth = guests * CONVERSION * nights * WEEKS_PER_MONTH;
    barOut.textContent = money(buyersPerMonth * DRINK_VALUE);
    machineOut.textContent = money(buyersPerMonth * AVG_TICKET);
  };

  estNights.addEventListener("input", update);
  estGuests.addEventListener("input", update);
  update();
}

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
