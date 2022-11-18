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
        this.setColor("input-field-border-color");
        this.setColor("h3-text-color");
        this.setColor("menu-title-color");
        this.setColor("menu-title-active-color");
        this.setColor("worldmap-stroke-bg");
        this.setColor("footer-bg");
        this.setColor("profile-text-color");
        this.setColor("p-text-color");
        this.setColor("card-statistic-title-color");
        this.setColor("table-bg");
        this.setColor("table-gradient-color");
        this.setColor("table-hover-bg");
        this.setColor("table-text-color");
        this.setColor("input-label-color");
        this.setColor("input-color");
        this.setColor("link-color");
        this.setColor("card-profile-title-color");
        this.setColor("footer-text-color");
        this.setColor("gallery-bg");
        this.setColor("card-text-color");
        this.setColor("content-language-bg");
        this.setColor("content-language-label-color");
    }
}