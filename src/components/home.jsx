import ledger from 'ledgerco';
import React, { Component } from 'react';

// TODO:
// this all needs refactor to services - - - - - -  - - - -

const bip39 = require('bip39');
const bigi = require('bigi')
const ec = require('elliptic').ec;
const CryptoJS = require('crypto-js');

const BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const base58 = require( 'base-x' )( BASE58 );
const net = 'TestNet';
const mnemonic = "online ramp onion faculty trap clerk near rabbit busy gravity prize employ exit horse found slogan effort dash siren buzz sport pig coconut element";

const bip44_path =
  "8000002C" +
  "80000378" +
  "80000000" +
  "80000000" +
  "80000000";

let ledgerDeviceInfo = undefined,
    publicKeyInfo = undefined,
    publicKey = undefined,
    accounts = undefined,
    signature = undefined,
    signatureInfo = undefined,
    balance = undefined,
    balanceInfo = undefined,
    encodeTransactionResponse = undefined,
    signedTransaction = undefined,
    sentTransaction = undefined,
    sentTransactionInfo = undefined,
    bip44Path = undefined;

let getLedgerDeviceInfo = () => {
  ledger.comm_u2f.create_async().then(comm => {
    if (comm.device){
      let deviceInfo = comm.device.getDeviceInfo();
      comm.device.close();
      ledgerDeviceInfo = 'Success: ' + JSON.stringify( deviceInfo );
      renderApp();
      setAllLedgerInfoTimer();
    } else {
      console.error('No device found');
    }
  }).catch(error => {
    console.error('An error occured: ' + JSON.stringify(error));
    renderApp();
    setAllLedgerInfoTimer();
  });
}

let getPublicKeyInfo = function() {
  publicKey = undefined;
  publicKeyInfo = undefined;
  ledger.comm_u2f.create_async().then(comm => {
    let message = Buffer.from( "8004000000" + bip44_path, "hex" );
    let validStatus = [0x9000];
    comm.exchange( message.toString( "hex" ), validStatus ).then( function( response ) {
      comm.device.close();

      // console.log( "Public Key Response [" + response.length + "] " + response + "\n" );

      let publicKey = response.substring( 0, 130 );

      console.log( "Public Key [" + publicKey.length + "] " + publicKey + "\n" );

      publicKeyInfo = publicKey;

      renderApp();
      setAllLedgerInfoTimer();
    } ).catch(error => {
      comm.device.close();
      console.error("error reason " + error + "\n" );
      publicKeyInfo = "An error occured[1]: " + error;
      renderApp();
      setAllLedgerInfoTimer();
    });
  }).catch(error => {
    console.error("error reason " + error);
    publicKeyInfo = "An error occured[2]: " + error;
    renderApp();
    setAllLedgerInfoTimer();
  });
}

let allLedgerInfoPollIx = 0;

let setAllLedgerInfoTimer = function() {
  setImmediate( getAllLedgerInfo );
}

let getAllLedgerInfo = function() {
  console.log( "getAllLedgerInfo " + allLedgerInfoPollIx + "\n" );
  let resetPollIndex = false;
  switch ( allLedgerInfoPollIx ) {
    case 0:
      getLedgerDeviceInfo();
      break;
    case 1:
      getPublicKeyInfo();
      break;
    default:
      allLedgerInfoPollIx = 0;
      resetPollIndex = true;
  }
  if ( resetPollIndex ) {
    // periodically check for a new device, disabled for now to not spam the logs.
    // setTimeout( getAllLedgerInfo, 10000 );
  } else {
    allLedgerInfoPollIx++;
  }
};

setAllLedgerInfoTimer();

let createSignature = function() {
    let text = encodeTransactionResponse;

    let textToSign = text + bip44_path;

    signature = undefined;
    signatureInfo = "Ledger Signing Text of Length [" + textToSign.length + "], Please Confirm Using the Device's Buttons. " + textToSign;
    renderApp();

    console.log( signatureInfo + "\n" );

    let validStatus = [0x9000];

    let messages = [];

    let bufferSize = 255 * 2;
    let offset = 0;
    while ( offset < textToSign.length ) {
        let chunk;
        let p1;
        if ( ( textToSign.length - offset ) > bufferSize ) {
            chunk = textToSign.substring( offset, offset + bufferSize );
        } else {
            chunk = textToSign.substring( offset );
        }
        if ( ( offset + chunk.length ) == textToSign.length ) {
            p1 = "80";
        } else {
            p1 = "00";
        }

        let chunkLength = chunk.length / 2;

        console.log( "Ledger Signature chunkLength " + chunkLength + "\n" );

        let chunkLengthHex = chunkLength.toString( 16 );
        while ( chunkLengthHex.length < 2 ) {
            chunkLengthHex = "0" + chunkLengthHex;
        }

        console.log( "Ledger Signature chunkLength hex " + chunkLengthHex + "\n" );

        messages.push( "8002" + p1 + "00" + chunkLengthHex + chunk );
        offset += chunk.length;
    }

    ledger.comm_u2f.create_async( 0, false ).then( function( comm ) {
        for ( let ix = 0; ix < messages.length; ix++ ) {
            let message = messages[ix];
            console.log( "Ledger Message (" + ix +
                "/" + messages.length +
                ") " + message + "\n" );

            comm.exchange( message, validStatus ).then( function( response ) {
                console.log( "Ledger Signature Response " + response + "\n" );
                if ( response != "9000" ) {
                    comm.device.close();

                    /**
                     * https://stackoverflow.com/questions/25829939/specification-defining-ecdsa-signature-data
                     * <br>
                     * the signature is TLV encoded.
                     * the first byte is 30, the "signature" type<br>
                     * the second byte is the length (always 44)<br>
                     * the third byte is 02, the "number: type<br>
                     * the fourth byte is the length of R (always 20)<br>
                     * the byte after the encoded number is 02, the "number: type<br>
                     * the byte after is the length of S (always 20)<br>
                     * <p>
                     * eg:
                     * 304402200262675396fbcc768bf505c9dc05728fd98fd977810c547d1a10c7dd58d18802022069c9c4a38ee95b4f394e31a3dd6a63054f8265ff9fd2baf68a9c4c3aa8c5d47e9000
                     * is
                     * 30LL0220RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR0220SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS
                     */

                    let rLenHex = response.substring( 6, 8 );
                    // console.log( "Ledger Signature rLenHex " + rLenHex + "\n" );
                    let rLen = parseInt( rLenHex, 16 ) * 2;
                    // console.log( "Ledger Signature rLen " + rLen + "\n" );
                    let rStart = 8;
                    // console.log( "Ledger Signature rStart " + rStart + "\n" );
                    let rEnd = rStart + rLen;
                    // console.log( "Ledger Signature rEnd " + rEnd + "\n" );

                    while ( ( response.substring( rStart, rStart + 2 ) == "00" ) && ( ( rEnd - rStart ) > 64 ) ) {
                        rStart += 2;
                    }

                    let r = response.substring( rStart, rEnd );
                    console.log( "Ledger Signature R [" + rStart + "," + rEnd + "]:" + ( rEnd - rStart ) + " " + r + "\n" );
                    let sLenHex = response.substring( rEnd + 2, rEnd + 4 );
                    // console.log( "Ledger Signature sLenHex " + sLenHex + "\n" );
                    let sLen = parseInt( sLenHex, 16 ) * 2;
                    // console.log( "Ledger Signature sLen " + sLen + "\n" );
                    let sStart = rEnd + 4;
                    // console.log( "Ledger Signature sStart " + sStart + "\n" );
                    let sEnd = sStart + sLen;
                    // console.log( "Ledger Signature sEnd " + sEnd + "\n" );

                    while ( ( response.substring( sStart, sStart + 2 ) == "00" ) && ( ( sEnd - sStart ) > 64 ) ) {
                        sStart += 2;
                    }

                    let s = response.substring( sStart, sEnd );
                    console.log( "Ledger Signature S [" + sStart + "," + sEnd + "]:" + ( sEnd - sStart ) + " " + s + "\n" );

                    let msgHashStart = sEnd + 4;
                    let msgHashEnd = msgHashStart + 64;
                    let msgHash = response.substring( msgHashStart, msgHashEnd );
                    console.log( "Ledger Signature msgHash [" + msgHashStart + "," + msgHashEnd + "] " + msgHash + "\n" );

                    signature = r + s;
                    signatureInfo = "Signature of Length [" + signature.length + "] : " + signature;
                    console.log( signatureInfo + "\n" );

                    console.log( "Check Signature of Length [" + checkSignature.length + "] : " + checkSignature + "\n" );
                    renderApp();
                }
            } )
                .catch( function( reason ) {
                    comm.device.close();
                    signatureInfo = "An error occured[1]: " + reason;
                    console.log( "Signature Reponse " + signatureInfo + "\n" );
                    renderApp();
                } );
        }
    } )
        .catch( function( reason ) {
            comm.device.close();
            signatureInfo = "An error occured[2]: " + reason;
            console.log( "Signature Reponse " + signatureInfo + "\n" );
            renderApp();
        } );
}


// end todo refactor - - - - - -  - - - -



class App extends Component {
  constructor() {
    super()
  }

  getPublicKeyInfo() {}

  getLedgerDeviceInfo() {}

  getAllLedgerInfo() {}

  createSignature () {}

  render () {
    return (
      <div>
        <header>
          <p><strong>Donation address</strong><br /></p>
          <p>xrb_18b8crf6exoup5zgbkfyoutmya53h86wk3qmziqgze3fhpr3j7w49gippz6c</p>
        </header>
        <div className="container">
          <h1>Ledger NodeJS</h1>
          <div>
            <h2>Public Key</h2>
            <p><code>{publicKeyInfo}</code></p>
            <p>
              <label>Destination Address</label>
              <input type="text" id="toAddress" placeholder="Destination Address" />
            </p>
            <p>
              <label>Amount</label>
              <input type="number" step="0.000001" min="1" id="amount" placeholder="Amount" />
            </p>
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
          </div>
        </div>
      </div>
    )
  }
}

export default App
