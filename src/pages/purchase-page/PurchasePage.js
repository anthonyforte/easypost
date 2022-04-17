import React, { Component } from 'react';

import ShipmentForm from 'src/forms/shipment-form/ShipmentForm';

export default class PurchasePage extends Component {

  render() {
    return (
      <div className='layout-container'>
        <h1>Create Shipment Label</h1>
        <br/>
        <ShipmentForm />
      </div>
    );
  }

}
