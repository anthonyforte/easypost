import React, { Component } from 'react';

import Alert from 'react-bootstrap/Alert';

export default class TimedAlert extends Component {

  static timer;

  constructor(props) {
    super(props);
    this.state = {
      show: true
    };
    this.timer = setTimeout(
      () => this.close(),
      (this.props.timeout ? this.props.timeout : 5000) // default 5s
    );
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  close() {
    this.setState({
      show: false
    });

    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  render() {
    return (
      <Alert show={this.state.show}  onClose={() => this.close()} variant="warning" dismissible>
        <Alert.Heading>{this.props.heading}</Alert.Heading>
        <p>
          {this.props.body}
        </p>
      </Alert>
    );
  }

}
