import React, { Component } from 'react';

import Navigation from 'src/components/navigation/Navigation';

export default class NavWrapper extends Component {

  render() {
    return(
      <div className='navbar-wrapper'>
        <Navigation/>
        {this.props.component}
      </div>
    );
  }

}
