import localStorageUtil from "./localStorage.util";

export default class ThemeUtil {
    isDarkTheme: boolean;
    root: HTMLElement;
    constructor(isDarkTheme: boolean) {
        this.isDarkTheme = isDarkTheme;
        this.root = document.documentElement;
    }

    private addTheme(variable: string) {
        return `--theme-${variable}`;
    }

    private var(variable: string) {
        return `var(${variable}-${this.isDarkTheme ? "dark" : "light"})`;
    }

    private setColor(variable: string) {
        variable = this.addTheme(variable);
        this.root.style.setProperty(variable, this.var(variable))
    }

    private sidebar() {
        this.setColor("sidebar-bg");
        this.setColor("sidebar-menu-hover-bg");
    }


    setThemeColor() {
        this.sidebar();
        this.root.style.setProperty("--theme-navbar-bg-color", this.isDarkTheme ? "#1c1c1c" : "#fff")
        this.root.style.setProperty("--theme-bg-color", this.isDarkTheme ? "#1c1c1c" : "#fff")
        this.root.style.setProperty("--theme-content-wrapper-bg-color", this.isDarkTheme ? "#333333" : "#f2edf3")
        this.root.style.setProperty("--theme-h3-text-color", this.isDarkTheme ? "#fff" : "#000")
        this.root.style.setProperty("--theme-menu-title-color", this.isDarkTheme ? "#b0bec5" : "inherit")
        this.root.style.setProperty("--theme-menu-title-active-color", this.isDarkTheme ? "#fff" : "#000")
    }
}