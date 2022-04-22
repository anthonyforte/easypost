import React, { Component } from 'react';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import { withRouter } from 'src/utilities/routing/withRouter.js';

class Navigation extends Component {

  render() {
    return (
      <Navbar collapseOnSelect className='px-3' expand='lg' sticky='top' bg='white'>
        <Navbar.Brand href='/'>EzPost</Navbar.Brand>
        <Navbar.Toggle/>
        <Navbar.Collapse id='responsive-navbar-nav'>
          <Nav className='ms-auto'>
            <Nav.Link href='/create'>Create Label</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }

}

export default withRouter(Navigation);
