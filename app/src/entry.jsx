import React from 'react'
import ReactDOM from 'react-dom'
import App from './app.jsx'

import 'bootstrap/scss/bootstrap.scss';

require('./main.sass')

let renderApp = () => {
  ReactDOM.render(<App />, document.getElementById('app'))
}

renderApp()
