export default {
    adminLanguage: {
        get get(): number {
            return Number((window.localStorage.getItem("adminLanguage") ?? 1));
        },
        set: (langId: number) => {
            window.localStorage.setItem("adminLanguage", langId.toString());
        }
    }
}