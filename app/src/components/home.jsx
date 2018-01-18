import React, { Component } from 'react'

export default class Home extends React.Component {
  constructor() {
    super()
  }

  encodeTransaction () {}

  createSignature () {}

  signTransaction () {}

  sendTransaction () {}

  render () {
    return (
      <div className="container">
        <h2>Home Component</h2>
        <p>Keys to follow...</p>
        {/*
        <h2>Public Key</h2>
        <p><code>{publicKeyInfo}</code></p>
        <p>Destination Address <input type="text" id="toAddress" placeholder="Destination Address" /></p>
        <p>Amount <input type="number" step="0.000001" min="1" id="amount" placeholder="Amount" /></p>
        <p><button onClick={(e) => encodeTransaction()}>Encode</button></p>
        <p>Encoded Transaction, before signing</p>
        <p>{encodeTransactionResponse}</p>
        <p><button onClick={(e) => createSignature()}>Create Signature</button></p>
        <h2>Signature</h2>
        <p><code>{signatureInfo}</code></p>
        <p><button onClick={(e) => signTransaction()}>Sign Transaction</button></p>
        <h2>Signed Transaction</h2>
        <p><code>{signedTransaction}</code></p>
        <p><button onClick={(e) => sendTransaction()}>Send Transaction</button></p>
        <h2>Sent Transaction</h2>
        <p><code>{sentTransactionInfo}</code></p>
        */}
      </div>
    )
  }
}
