import React, { Component } from 'react';
import axios from 'axios';

import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';

import configData from 'src/config.json';

export default class ShipmentsTable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      shipments: [],
      hasMore: false,
      pageIds: [''],
      currPage: 0
    }
  }

  componentDidMount() {
    this.fetchShipments();
  }

  componentWillUnmount() {
    this.setState({
      shipments: [],
      hasMore: false,
      pageIds: [''],
      currPage: 0
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.currPage !== this.state.currPage) {
      this.fetchShipments();
    }
  }

  async fetchShipments() {
    const params = {
      page_size: 5,
      before_id: this.state.pageIds[this.state.currPage]
    };

    try {
      const response = await axios.get(`${configData.API_URL}/shipments`, { params });
      if (response.status === 200) {
        let pageIds;
        if (this.state.currPage === this.state.pageIds.length-1) {
          pageIds = [...this.state.pageIds, response.data.shipments.at(-1).id];
        } else {
          pageIds = this.state.pageIds;
        }

        this.setState({
          shipments: response.data.shipments,
          hasMore: response.data.has_more,
          pageIds: pageIds
        });
      }
    } catch(err) {
      console.log(err);
    }
  }

  handlePagination(event) {
    const back = event.target.value === 'back';
    this.setState({
      currPage: (back ? this.state.currPage-1 : this.state.currPage+1)
    });
  }

  render() {
    return (
      <div className='shipments-table'>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Date</th>
              <th>To</th>
              <th>Status</th>
              <th>Tracking</th>
              <th>Label</th>
            </tr>
          </thead>
          <tbody>
            {this.state.shipments.map(shipment =>
              <tr key={shipment.id}>
                <td>{new Date(shipment.created_at).toLocaleString()}</td>
                <td>{shipment.buyer_address.name}</td>
                <td>{shipment.status.toUpperCase()}</td>
                <td>
                  {<a href={shipment.tracker.public_url} target="_blank" rel="noopener noreferrer">{shipment.tracking_code}</a>}
                </td>
                <td>
                  {<a href={shipment.postage_label.label_url} target="_blank" rel="noopener noreferrer">Download</a>}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        <Button
          className='me-2'
          value='back'
          disabled={this.state.currPage === 0}
          onClick={(e) => this.handlePagination(e)}
        >Back</Button>
        <Button
          className='me-2'
          value='next'
          disabled={!this.state.hasMore}
          onClick={(e) => this.handlePagination(e)}
        >Next</Button>
      </div>
    );
  }

}
