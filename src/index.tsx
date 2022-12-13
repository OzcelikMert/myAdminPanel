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

