// ─────────────────────────────────────────────────────────────
//  theme.ts — Dark/Light mode management
//  Reads/writes data-theme attribute on <html>
//  Persists preference to localStorage
// ─────────────────────────────────────────────────────────────

export function getTheme(): "dark" | "light" {
  if (typeof window === "undefined") return "dark";
  return (localStorage.getItem("tf-theme") as "dark" | "light") || "dark";
}

export function setTheme(theme: "dark" | "light") {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("tf-theme", theme);
}

export function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "dark";
  setTheme(current === "dark" ? "light" : "dark");
  return current === "dark" ? "light" : "dark";
}

export function initTheme() {
  const theme = getTheme();
  document.documentElement.setAttribute("data-theme", theme);
}
