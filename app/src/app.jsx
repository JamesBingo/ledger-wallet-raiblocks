import React, { Component } from 'react'
import Home from './components/home.jsx'

import { Row, Col } from 'reactstrap'

export default class App extends React.Component {
  constructor() {
    super()
  }

  render () {
    return (
      <div>
        <header>
          <h1>Ledger NodeJS</h1>
          <p>Donation address:</p>
          <p>xrb_18b8crf6exoup5zgbkfyoutmya53h86wk3qmziqgze3fhpr3j7w49gippz6c</p>
          <Row>
            <Col>
              Accounts
            </Col>
            <Col>
              Send
            </Col>
            <Col>
              Receive
            </Col>
            <Col>
              Settings
            </Col>
          </Row>
        </header>
        <Home />
      </div>
    );
  }
}
