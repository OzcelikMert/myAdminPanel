import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import "./library/variable/array"
import "./library/variable/string"
import "./library/variable/number"
import "./library/variable/date"
import "./library/variable/math"

import AppAdmin from "./app/admin/";


ReactDOM.render(
  <BrowserRouter>
      <AppAdmin/>
  </BrowserRouter>,
  document.getElementById('root')
);
