import React, { Component } from 'react';
import axios from 'axios';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import TimedAlert from 'src/components/alert/TimedAlert';

export default class AddressForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      prefix: Prefix.fromId(this.props.prefix),
      address: {
        street1: '',
        street2: '',
        city: '',
      	state: '',
      	zip: '',
      	country: '',
      	name: '',
      	company: '',
      	phone: '',
      	email: ''
      },
      error: false
    };
  }

  // handle form submission and create/verify address with the backend
  async handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    try {
      const response = await axios.post('http://localhost:8000/addresses', this.state.address);
      if (response.status === 200) {
        // check verifications
        const verifications = response.data.verifications;
        for (var key of Object.keys(verifications)) {
          if (!verifications[key].success) {
            throw new Error('could not verify address');
          }
        }

        // run callback function if provided
        if (this.props.onSubmit) {
          // return the address id
          this.props.onSubmit(response.data.id);
        }
      } else {
        throw new Error('could not verify address');
      }
    } catch(err) {
      this.setState({
        error: true
      });
    }
  }

  // capture and change in user input and update this.state
  handleChange(event) {
    const address = { ...this.state.address, [event.target.name]: event.target.value }
    this.setState({
      address: address
    });
  }

  renderAlert() {
    if (this.state.error) {
      return (
        <TimedAlert
          timeout={10000}
          heading='Could not verify address!'
          body='Please check your address for errors and re-submit.'
          onClose={() => this.setState({ error: false })}
        />
      );
    }
  }

  render() {
    return (
      <Form onSubmit={(e) => this.handleSubmit(e)}>
        <h5>{this.state.prefix.formatted}Address</h5>
        {this.renderAlert()}
        <Row>
          <Col>
            <Form.Group className='mb-3' controlId={`${this.state.prefix.id}Name`}>
              <Form.Label className='required'>Name</Form.Label>
              <Form.Control
                required
                type='text'
                name='name'
                onChange={(e) => this.handleChange(e)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className='mb-3' controlId={`${this.state.prefix.id}Company`}>
              <Form.Label>Company</Form.Label>
              <Form.Control
                type='text'
                name='company'
                onChange={(e) => this.handleChange(e)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group className='mb-3' controlId={`${this.state.prefix.id}Phone`}>
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type='text'
                name='phone'
                onChange={(e) => this.handleChange(e)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className='mb-3' controlId={`${this.state.prefix.id}Email`}>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type='email'
                name='email'
                onChange={(e) => this.handleChange(e)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group className='mb-3' controlId={`${this.state.prefix.id}Street1`}>
              <Form.Label className='required'>Street 1</Form.Label>
              <Form.Control
                required
                type='text'
                name='street1'
                onChange={(e) => this.handleChange(e)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className='mb-3' controlId={`${this.state.prefix.id}Street2`}>
              <Form.Label>Street 2</Form.Label>
              <Form.Control
                type='text'
                name='street2'
                onChange={(e) => this.handleChange(e)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <Form.Group className='mb-3' controlId={`${this.state.prefix.id}City`}>
              <Form.Label className='required'>City</Form.Label>
              <Form.Control
                required
                type='text'
                name='city'
                onChange={(e) => this.handleChange(e)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className='mb-3' controlId={`${this.state.prefix.id}State`}>
              <Form.Label className='required'>State</Form.Label>
              <Form.Control
                required
                type='text'
                name='state'
                onChange={(e) => this.handleChange(e)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className='mb-3' controlId={`${this.state.prefix.id}Zip`}>
              <Form.Label className='required'>Zip</Form.Label>
              <Form.Control
                required
                type='text'
                name='zip'
                onChange={(e) => this.handleChange(e)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <Form.Group className='mb-3' controlId={`${this.state.prefix.id}Country`}>
              <Form.Label className='required'>Country</Form.Label>
              <Form.Control
                required
                type='text'
                name='country'
                onChange={(e) => this.handleChange(e)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Button variant='primary' type='submit'>
          {this.props.actionText ? this.props.actionText : 'Submit'}
        </Button>
      </Form>
    );
  }

}

class Prefix {

  static TO = new Prefix('to', 'To ');
  static FROM = new Prefix('from', 'From ');
  static NONE = new Prefix('', '');

  constructor(id, formatted) {
    this.id = id;
    this.formatted = formatted;
  }

  static fromId(id) {
    switch (id) {
      case 'to':
        return this.TO;
      case 'from':
        return this.FROM;
      default:
        return this.NONE;
    }
  }

}
