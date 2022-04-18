import React, { Component } from 'react';
import axios from 'axios';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

import AddressForm from 'src/forms/address-form/AddressForm';
import ParcelForm from 'src/forms/parcel-form/ParcelForm';

import configData from 'src/config.json';

export default class ShipmentForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      toAddressID: '',
      fromAddressID: '',
      parcelID: '',
      shipmentID: '',
      rateID: '',
      rates: [],
      carriers: [],
      selectedCarrier: '',
      selectedTab: 'toAddress' // default tab selection
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.toAddressID !== this.state.toAddressID ||
      prevState.fromAddressID  !== this.state.fromAddressID ||
      prevState.parcelID  !== this.state.parcelID
    ) {
      // if any of the the above IDs was updated try to create/re-create a shipment
      this.createShipment();
    }
  }

  // request a shipment to be created from the backend
  async createShipment() {
    if (this.state.toAddressID && this.state.fromAddressID && this.state.parcelID) {
      const params = {
        to_address_id: this.state.toAddressID,
        from_adddress_id: this.state.fromAddressID,
        parcel_id: this.state.parcelID
      };
      const response = await axios.post(`${configData.API_URL}/shipments`, {}, { params });

      // determine unique carriers
      var carriers = new Set();
      response.data.rates.forEach(r => carriers.add(r.carrier));

      this.setState({
        shipmentID: response.data.id,
        rates: response.data.rates,
        carriers: [...carriers],
        selectedCarrier: [...carriers][0],
        selectedTab: 'rates' // progress to rates tab
      });
    }
  }

  // request a shipment to be purchased with a specific rate
  async buyShipment(event) {
    event.preventDefault();
    event.stopPropagation();

    if (this.state.shipmentID && this.state.rateID) {
      const params = {
        rate_id: this.state.rateID
      };

      const response = await axios.post(`${configData.API_URL}/shipments/${this.state.shipmentID}/buy`, {}, { params });
      window.open(response.data.postage_label.label_url); // open the label in a new window
    }
  }

  handleTabSelect(key) {
    this.setState({
      selectedTab: key
    });
  }

  updateToAddress(id) {
    this.setState({
      toAddressID: id,
      selectedTab: this.state.fromAddressID === '' ? 'fromAddress' : this.state.selectedTab
    });
  }

  updateFromAddress(id) {
    this.setState({
      fromAddressID: id,
      selectedTab: this.state.parcelID === '' ? 'parcel' : this.state.selectedTab
    });
  }

  updateParcel(id) {
    this.setState({
      parcelID: id,
    });
  }

  updateRate(event) {
    this.setState({
      rateID: event.target.value
    });
  }

  updateCarrier(event) {
    this.setState({
      selectedCarrier: event.target.value
    });
  }

  // probably won't be used anywhere else in app but can be moved later if needed
  renderRatesForm() {
    return (
      <Form onSubmit={(e) => this.buyShipment(e)}>
        <h5>Rates</h5>
        <Row>
          <Col xs={3}>
            <Form.Group className='mb-3' controlId='carrier'>
              <Form.Select
                disabled={this.state.carriers.length === 0}
                onChange={(e) => this.updateCarrier(e)}
              >
                {this.state.carriers.map(carrier =>
                  <option value={carrier} key={carrier}>{carrier}</option>
                )}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col xs={3}>
            <Form.Group className='mb-3' controlId='rate'>
              {this.state.rates.filter(rate => rate.carrier === this.state.selectedCarrier).map(rate =>
                <Form.Check
                  required
                  label={`${rate.service} -  $${rate.list_rate}`}
                  name='rates'
                  type='radio'
                  value={rate.id}
                  key={rate.id}
                  onChange={(e) => this.updateRate(e)}
                />
              )}
            </Form.Group>
          </Col>
        </Row>
        <Button variant='primary' type='submit'>
          Purchase
        </Button>
      </Form>
    );
  }

  render() {
    return (
      <Tabs
        id='shipment-tabs'
        className='mb-3'
        activeKey={this.state.selectedTab}
        onSelect={(key) => this.handleTabSelect(key)}
      >
        <Tab eventKey='toAddress' title='To Address'>
          <AddressForm prefix='to' actionText='Next' onSubmit={(id) => this.updateToAddress(id)}/>
        </Tab>

        <Tab eventKey='fromAddress' title='From Address' disabled={this.state.toAddressID === ''}>
          <AddressForm prefix='from' actionText='Next' onSubmit={(id) => this.updateFromAddress(id)}/>
        </Tab>

        <Tab eventKey='parcel' title='Parcel' disabled={this.state.fromAddressID === ''}>
          <ParcelForm  actionText='Next' onSubmit={(id) => this.updateParcel(id)}/>
        </Tab>

        <Tab eventKey='rates' title='Rates' disabled={this.state.rates.length === 0}>
          {this.renderRatesForm()}
        </Tab>
      </Tabs>
    );
  }

}
