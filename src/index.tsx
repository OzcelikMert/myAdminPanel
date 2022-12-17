import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';

import "library/variable/array"
import "library/variable/string"
import "library/variable/number"
import "library/variable/date"
import "library/variable/math"

import AppAdmin from "./app";
import themeUtil from "utils/theme.util";
import localStorageUtil from "utils/localStorage.util";

import {LanguageId, Languages} from "constants/languages";
import i18n from "i18next";
import {initReactI18next} from "react-i18next";

import English from "./languages/en.json"
import Turkish from "./languages/tr.json"

const language = i18n.use(initReactI18next);

language.init({
    resources: {
        en: {translation: English},
        tr: {translation: Turkish}
    },
    keySeparator: false,
    lng: Languages.findSingle("id", localStorageUtil.adminLanguage.get)?.code || window.navigator.language.slice(0, 2) || Languages[0].code,
    fallbackLng: Languages.findSingle("id", LanguageId.English)?.code || Languages[0].code,
    interpolation: {
        escapeValue: false
    }
});

class App extends Component<{}, {}> {
    constructor(props: any) {
        super(props);
        (new themeUtil(localStorageUtil.adminIsDarkTheme.get)).setThemeColor();
    }

    render() {
        return (
            <BrowserRouter>
                <AppAdmin/>
            </BrowserRouter>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);

