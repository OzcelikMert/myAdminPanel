import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';

import "./library/variable/array"
import "./library/variable/string"
import "./library/variable/number"
import "./library/variable/date"
import "./library/variable/math"

import AppAdmin from "./app";
import themeUtil from "./utils/theme.util";
import localStorageUtil from "./utils/localStorage.util";

class App extends Component<{}, {}> {
    constructor(props: any) {
        super(props);
        themeUtil.setThemeColor(localStorageUtil.adminIsDarkTheme.get);
    }

    render() {
        return (
            <BrowserRouter basename="admin">
                <AppAdmin/>
            </BrowserRouter>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);

