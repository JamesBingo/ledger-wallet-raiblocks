'use strict';

require('./screen.sass')

import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/home.jsx'

var renderApp = () => {
  ReactDOM.render( <App />, document.getElementById('app') )
}

renderApp()
