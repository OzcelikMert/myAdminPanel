import localStorageUtil from "./localStorage.util";

export default class ThemeUtil {
    isDarkTheme: boolean;
    root: HTMLElement;
    constructor(isDarkTheme: boolean) {
        this.isDarkTheme = isDarkTheme;
        this.root = document.documentElement;
    }

    private var(variable: string) {
        return `var(--${variable}-${this.isDarkTheme ? "dark" : "light"})`;
    }

    private setColorWithVar(variable: string, value: string) {
        this.root.style.setProperty(variable, this.var(value))
    }

    private setColor(variable: string, value: string) {
        this.root.style.setProperty(variable, value)
    }

    private sidebar() {
        this.setColorWithVar("--theme-sidebar-bg", "sidebar-bg");
    }


    setThemeColor() {
        this.sidebar();
        this.setColor("--theme-navbar-bg-color", this.isDarkTheme ? "#1c1c1c" : "#fff")
        this.setColor("--theme-bg-color", this.isDarkTheme ? "#1c1c1c" : "#fff")
        this.setColor("--theme-content-wrapper-bg-color", this.isDarkTheme ? "#333333" : "#f2edf3")
        this.setColor("--theme-h3-text-color", this.isDarkTheme ? "#fff" : "#000")
        this.setColor("--theme-menu-title-color", this.isDarkTheme ? "#b0bec5" : "inherit")
        this.setColor("--theme-menu-title-active-color", this.isDarkTheme ? "#fff" : "#000")
    }
}