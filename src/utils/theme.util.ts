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


    setThemeColor() {
        this.setColor("sidebar-bg");
        this.setColor("sidebar-menu-hover-bg");
        this.setColor("navbar-bg");
        this.setColor("bg");
        this.setColor("content-wrapper-bg");
        this.setColor("h3-text-color");
        this.setColor("menu-title-color");
        this.setColor("menu-title-active-color");
    }
}