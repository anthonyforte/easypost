import React, { Component } from 'react';

import Alert from 'react-bootstrap/Alert';

export default class TimedAlert extends Component {

  static timer;

  constructor(props) {
    super(props);
    this.timer = setTimeout(
      () => this.close(),
      (this.props.timeout ? this.props.timeout : 5000) // default 5s
    );
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  close() {
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  render() {
    return (
      <Alert show={true}  onClose={() => this.close()} variant="warning" dismissible>
        <Alert.Heading>{this.props.heading}</Alert.Heading>
        <p>
          {this.props.body}
        </p>
      </Alert>
    );
  }

}
