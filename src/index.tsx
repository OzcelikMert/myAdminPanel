import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';

import "./library/variable/array"
import "./library/variable/string"
import "./library/variable/number"
import "./library/variable/date"
import "./library/variable/math"

import AppAdmin from "./app";

class App extends Component<{}, {}> {
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

