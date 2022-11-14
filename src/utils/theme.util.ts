import localStorageUtil from "./localStorage.util";

export default {
    setThemeColor(isDarkTheme: boolean) {
        const root = document.documentElement;
        root.style.setProperty("--theme-navbar-bg-color", isDarkTheme ? "#1c1c1c" : "#fff")
        root.style.setProperty("--theme-bg-color", isDarkTheme ? "#1c1c1c" : "#fff")
        root.style.setProperty("--theme-content-wrapper-bg-color", isDarkTheme ? "#333333" : "#f2edf3")
        root.style.setProperty("--theme-h3-text-color", isDarkTheme ? "#fff" : "#000")
        root.style.setProperty("--theme-menu-title-color", isDarkTheme ? "#b0bec5" : "inherit")
        root.style.setProperty("--theme-menu-title-active-color", isDarkTheme ? "#fff" : "#000")
    }
}