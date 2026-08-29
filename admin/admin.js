(function () {
  const toggle = document.getElementById("adminThemeToggle");
  if (!toggle) return;

  const label = toggle.querySelector(".admin-theme-toggle__label");
  const storageKey = "shiva-admin-theme";

  function setTheme(theme) {
    const dark = theme === "dark";
    document.body.classList.toggle("admin-dark", dark);
    toggle.setAttribute("aria-pressed", dark ? "true" : "false");
    toggle.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    if (label) label.textContent = dark ? "Light mode" : "Dark mode";
  }

  setTheme(localStorage.getItem(storageKey) || "light");

  toggle.addEventListener("click", function () {
    const nextTheme = document.body.classList.contains("admin-dark") ? "light" : "dark";
    localStorage.setItem(storageKey, nextTheme);
    setTheme(nextTheme);
  });
})();
