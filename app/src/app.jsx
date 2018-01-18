import React, { Component } from 'react'
import Home from './components/home.jsx'

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
          <hr />
        </header>
        <Home />
      </div>
    );
  }
}
