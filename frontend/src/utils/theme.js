export const setTheme = (isDark) => {
  if (isDark) {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("darkMode", "true");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("darkMode", "false");
  }
};

export const getTheme = () => {
  return localStorage.getItem("darkMode") === "true";
};
