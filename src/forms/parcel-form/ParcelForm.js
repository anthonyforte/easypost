import React, { Component } from 'react';
import axios from 'axios';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import TimedAlert from 'src/components/alert/TimedAlert';

export default class ParcelForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      parcel: {
        length: 0,
        width: 0,
        height: 0,
        weight: 0
      },
      error: false
    };
  }

  // handle form submission and create/verify address with the backend
  async handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    try {
      const response = await axios.post('http://localhost:8000/parcels', this.state.parcel);
      if (response.status === 200) {
        // run callback function if provided
        if (this.props.onSubmit) {
          // return the parcel id
          this.props.onSubmit(response.data.id);
        }
      } else {
        throw new Error('could not create parcel');
      }
    } catch(err) {
      this.setState({
        error: true
      });
    }
  }

  // capture and change in user input and update this.state
  handleChange(event) {
    const parcel = { ...this.state.parcel, [event.target.name]: event.target.value }
    this.setState({
      parcel: parcel
    });
  }

  renderAlert() {
    if (this.state.error) {
      return (
        <TimedAlert
          timeout={10000}
          heading='Could not create parcel!'
          body='Please check your submission for errors and re-submit.'
          onClose={() => this.setState({ error: false })}
        />
      );
    }
  }

  render() {
    return (
      <Form onSubmit={(e) => this.handleSubmit(e)}>
        <h5>Parcel</h5>
        {this.renderAlert()}
        <Row>
          <Col>
            <Form.Group className='mb-3' controlId='length'>
              <Form.Label className='required'>Length (in.)</Form.Label>
              {/* Form.Control does not pass the step prop correctly so
                * instead explicity use <input /> with className='form-control'
                */}
              <input className='form-control'
                required
                type='number'
                step='0.1'
                min={0}
                name='length'
                onChange={(e) => this.handleChange(e)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className='mb-3' controlId='width'>
              <Form.Label className='required'>Width (in.)</Form.Label>
              <input className='form-control'
                required
                type='number'
                step='0.1'
                min={0}
                name='width'
                onChange={(e) => this.handleChange(e)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group className='mb-3' controlId='height'>
              <Form.Label className='required'>Height (in.)</Form.Label>
              <input className='form-control'
                required
                type='number'
                step='0.1'
                min={0}
                name='height'
                onChange={(e) => this.handleChange(e)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className='mb-3' controlId='weight'>
              <Form.Label className='required'>Weight (oz.)</Form.Label>
              <input className='form-control'
                required
                type='number'
                step='0.1'
                min={0}
                name='weight'
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
