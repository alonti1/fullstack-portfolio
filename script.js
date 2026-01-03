(function () {
  "use strict";

  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const toggleBtn = document.querySelector(".nav-toggle");
  const navList = document.getElementById("primary-nav");

  if (toggleBtn && navList) {
    toggleBtn.addEventListener("click", () => {
      const isOpen = toggleBtn.getAttribute("aria-expanded") === "true";
      toggleBtn.setAttribute("aria-expanded", String(!isOpen));
      navList.classList.toggle("open");
    });
  }

const root = document.documentElement;
const themeBtn = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

function setTheme(theme) {
  root.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);

  if (themeIcon) {
    themeIcon.textContent = theme === "dark" ? "☀️" : "🌙";
  }
}

const savedTheme = localStorage.getItem("theme");
setTheme(savedTheme || "light");

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const currentTheme =
      root.getAttribute("data-theme") === "dark" ? "dark" : "light";

    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  });
}

const form = document.getElementById("contactForm");
if (form) {
  const fullName = document.getElementById("fullName");
  const email = document.getElementById("email");
  const message = document.getElementById("message");

  const errName = document.getElementById("errName");
  const errEmail = document.getElementById("errEmail");
  const errMsg = document.getElementById("errMsg");
  const status = document.getElementById("formStatus");

  function isEmailValid(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
  }

  function setError(input, errEl, msg) {
    if (errEl) errEl.textContent = msg || "";
    if (input) input.setAttribute("aria-invalid", msg ? "true" : "false");
  }

  function validate() {
    let ok = true;
    if (status) status.textContent = "";

    const nameVal = (fullName?.value || "").trim();
    const emailVal = (email?.value || "").trim();
    const msgVal = (message?.value || "").trim();

    if (nameVal.length < 2) {
      setError(fullName, errName, "אנא הזן שם מלא (לפחות 2 תווים).");
      ok = false;
    } else {
      setError(fullName, errName, "");
    }

    if (!isEmailValid(emailVal)) {
      setError(email, errEmail, "אנא הזן אימייל תקין.");
      ok = false;
    } else {
      setError(email, errEmail, "");
    }

    if (msgVal.length < 10) {
      setError(message, errMsg, "אנא כתוב הודעה (לפחות 10 תווים).");
      ok = false;
    } else {
      setError(message, errMsg, "");
    }

    return ok;
  }

  [fullName, email, message].forEach((el) => {
    if (!el) return;
    el.addEventListener("blur", validate);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validate()) {
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    if (status) status.textContent = "ההודעה נשלחה בהצלחה! (דמו)";
    form.reset();

    setError(fullName, errName, "");
    setError(email, errEmail, "");
    setError(message, errMsg, "");
  });
}


})();
