require('./main.sass')

import React from 'react'
import ReactDOM from 'react-dom'
import App from './app.jsx'

let renderApp = () => {
  ReactDOM.render(<App />, document.getElementById('app'))
}

renderApp()
