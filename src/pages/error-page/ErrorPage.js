import React, { Component } from 'react';

import './ErrorPage.css';

export default class ErrorPage extends Component {

  render() {
    return (
      <div className='error-404-card'>
        <h3>404 Page Not Found!</h3>
        {this.props.message ? <h5>({this.props.message})</h5> : null}
      </div>
    );
  }

}
