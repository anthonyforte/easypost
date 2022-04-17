import React, { Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import ErrorPage from 'src/pages/error-page/ErrorPage';
import PurchasePage from 'src/pages/purchase-page/PurchasePage';

export default class App extends Component {

  render() {
    return (
      <BrowserRouter history={history}>
        <Routes>
          <Route path='/' element={<PurchasePage />} />
          <Route path='*' element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    );
  }

}

export const history = createBrowserHistory();
