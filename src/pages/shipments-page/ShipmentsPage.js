import React, { Component } from 'react';

import ShipmentsTable from 'src/components/shipments-table/ShipmentsTable';

export default class PurchasePage extends Component {

  render() {
    return (
      <div className='layout-container'>
        <h1>Shipments</h1>
        <br/>
        <ShipmentsTable />
      </div>
    );
  }

}
