"use strict";
const colors = require('colors');
const ledger = require('ledgerco')

ledger.comm_node.list_async().then(result => {
  if (result.length == 0) {
    console.log('NO LEDGER CONNECTED'.red);
  } else {
    console.log('WE HAVE A LEDGER'.green);
  }
}).catch((error) => {
  console.log('ERROR FETCHING LEDGER LIST'.red);
})


// const bip39     = require('bip39' );
// const bigi      = require('bigi');
// const ec        = require('elliptic').ec;
// const CryptoJS  = require('crypto-js');

// const BASE58    = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
// const base58    = require('base-x')(BASE58);

// const net = 'TestNet';
// const mnemonic = "online ramp onion faculty trap clerk near rabbit busy gravity prize employ exit horse found slogan effort dash siren buzz sport pig coconut element";
// const bip44_path =
//   "8000002C" +
//   "80000378" +
//   "80000000" +
//   "80000000" +
//   "80000000";

// let ledgerDeviceInfo = undefined,
//     publicKeyInfo = undefined,
//     publicKey = undefined,
//     accounts = undefined,
//     signature = undefined,
//     signatureInfo = undefined,
//     balance = undefined,
//     balanceInfo = undefined,
//     encodeTransactionResponse = undefined,
//     signedTransaction = undefined,
//     sentTransaction = undefined,
//     sentTransactionInfo = undefined,
//     bip44Path = undefined;

// let getLedgerDeviceInfo = () => {
//   logMsg( "getLedgerDeviceInfo \n" );

//   comm_node.list_async().then(result => {
//     if ( result.length == 0 ) {
//       logMsg( "getLedgerDeviceInfo \"No device found\"\n" );
//       ledgerDeviceInfo = "Failure : No device found";
//     } else {
//       comm_node.create_async().then(comm => {
//         let deviceInfo = comm.device.getDeviceInfo();
//         comm.device.close();

//         ledgerDeviceInfo = "Success: " + JSON.stringify( deviceInfo );
//         setAllLedgerInfoTimer();
//       }).catch(reason => {
//         comm.device.close();
//         ledgerDeviceInfo = "An error occured: " + JSON.stringify( reason );
//         setAllLedgerInfoTimer();
//       });
//     }
//   });
// }

// let getPublicKeyInfo = () => {
//   publicKey = undefined;
//   publicKeyInfo = undefined;
//   comm_node.create_async().then(comm => {
//     let message = Buffer.from( "8004000000" + bip44_path, "hex" );
//     let validStatus = [0x9000];
//     comm.exchange( message.toString( "hex" ), validStatus ).then(response => {
//       comm.device.close();

//       // logMsg( "Public Key Response [" + response.length + "] " + response + "\n" );

//       let publicKey = response.substring( 0, 130 );
//       logMsg( "Public Key [" + publicKey.length + "] " + publicKey + "\n" );

//       publicKeyInfo = publicKey;
//       setAllLedgerInfoTimer();
//     }).catch(reason => {
//       comm.device.close();
//       logMsg( "error reason " + reason + "\n" );
//       publicKeyInfo = "An error occured[1]: " + reason;
//       setAllLedgerInfoTimer();
//     });
//   }).catch(reason => {
//     comm.device.close();
//     logMsg( "error reason " + reason + "\n" );
//     publicKeyInfo = "An error occured[2]: " + reason;
//     setAllLedgerInfoTimer();
//   });
// }

// let allLedgerInfoPollIx = 0;

// let setAllLedgerInfoTimer = () => {
//   setImmediate( getAllLedgerInfo );
// }

// let getAllLedgerInfo = () => {
//   logMsg( "getAllLedgerInfo " + allLedgerInfoPollIx + "\n" );
//   let resetPollIndex = false;
//   switch ( allLedgerInfoPollIx ) {
//     case 0:
//       getLedgerDeviceInfo();
//       break;
//     case 1:
//       getPublicKeyInfo();
//       break;
//     default:
//       allLedgerInfoPollIx = 0;
//       resetPollIndex = true;
//   }
//   if ( resetPollIndex ) {
//     // periodically check for a new device, disabled for now to not spam the logs.
//     // setTimeout( getAllLedgerInfo, 10000 );
//   } else {
//     allLedgerInfoPollIx++;
//   }
// };

// let createSignature = () => {
//   let text = encodeTransactionResponse;

//   let textToSign = text + bip44_path;

//   signature = undefined;
//   signatureInfo = "Ledger Signing Text of Length [" + textToSign.length + "], Please Confirm Using the Device's Buttons. " + textToSign;

//   logMsg( signatureInfo + "\n" );

//   let validStatus = [0x9000];

//   let messages = [];

//   let bufferSize = 255 * 2;
//   let offset = 0;
//   while ( offset < textToSign.length ) {
//     let chunk;
//     let p1;
//     if ( ( textToSign.length - offset ) > bufferSize ) {
//       chunk = textToSign.substring( offset, offset + bufferSize );
//     } else {
//       chunk = textToSign.substring( offset );
//     }
//     if ( ( offset + chunk.length ) == textToSign.length ) {
//       p1 = "80";
//     } else {
//       p1 = "00";
//     }

//     let chunkLength = chunk.length / 2;

//     logMsg( "Ledger Signature chunkLength " + chunkLength + "\n" );

//     let chunkLengthHex = chunkLength.toString( 16 );
//     while ( chunkLengthHex.length < 2 ) {
//       chunkLengthHex = "0" + chunkLengthHex;
//     }

//     logMsg( "Ledger Signature chunkLength hex " + chunkLengthHex + "\n" );

//     messages.push( "8002" + p1 + "00" + chunkLengthHex + chunk );
//     offset += chunk.length;
//   }

//   comm_node.create_async( 0, false ).then(comm => {
//     for ( let ix = 0; ix < messages.length; ix++ ) {
//       let message = messages[ix];
//       logMsg( "Ledger Message (" + ix +
//         "/" + messages.length +
//         ") " + message + "\n" );

//       comm.exchange( message, validStatus ).then(response => {
//         logMsg( "Ledger Signature Response " + response + "\n" );
//         if ( response != "9000" ) {
//           comm.device.close();


//           let rLen = parseInt( rLenHex, 16 ) * 2;
//           let rStart = 8;
//           let rEnd = rStart + rLen;
//           // logMsg( "Ledger Signature rLenHex " + rLenHex + "\n" );
//           // logMsg( "Ledger Signature rLen " + rLen + "\n" );
//           // logMsg( "Ledger Signature rStart " + rStart + "\n" );
//           // logMsg( "Ledger Signature rEnd " + rEnd + "\n" );

//           while ( ( response.substring( rStart, rStart + 2 ) == "00" ) && ( ( rEnd - rStart ) > 64 ) ) {
//             rStart += 2;
//           }

//           let r = response.substring( rStart, rEnd );
//           logMsg( "Ledger Signature R [" + rStart + "," + rEnd + "]:" + ( rEnd - rStart ) + " " + r + "\n" );
//           let sLenHex = response.substring( rEnd + 2, rEnd + 4 );
//           let sLen = parseInt( sLenHex, 16 ) * 2;
//           let sStart = rEnd + 4;
//           let sEnd = sStart + sLen;
//           // logMsg( "Ledger Signature sLenHex " + sLenHex + "\n" );
//           // logMsg( "Ledger Signature sLen " + sLen + "\n" );
//           // logMsg( "Ledger Signature sStart " + sStart + "\n" );
//           // logMsg( "Ledger Signature sEnd " + sEnd + "\n" );

//           while ( ( response.substring( sStart, sStart + 2 ) == "00" ) && ( ( sEnd - sStart ) > 64 ) ) {
//             sStart += 2;
//           }

//           let s = response.substring( sStart, sEnd );
//           logMsg( "Ledger Signature S [" + sStart + "," + sEnd + "]:" + ( sEnd - sStart ) + " " + s + "\n" );

//           let msgHashStart = sEnd + 4;
//           let msgHashEnd = msgHashStart + 64;
//           let msgHash = response.substring( msgHashStart, msgHashEnd );
//           logMsg( "Ledger Signature msgHash [" + msgHashStart + "," + msgHashEnd + "] " + msgHash + "\n" );

//           signature = r + s;
//           signatureInfo = "Signature of Length [" + signature.length + "] : " + signature;
//           logMsg( signatureInfo + "\n" );

//           logMsg( "Check Signature of Length [" + checkSignature.length + "] : " + checkSignature + "\n" );
//         }
//       }).catch(reason => {
//         comm.device.close();
//         signatureInfo = "An error occured[1]: " + reason;
//         logMsg( "Signature Reponse " + signatureInfo + "\n" );
//       });
//     }
//   }).catch(reason => {
//     comm.device.close();
//     signatureInfo = "An error occured[2]: " + reason;
//     logMsg( "Signature Reponse " + signatureInfo + "\n" );
//   });
// }

// setAllLedgerInfoTimer();
