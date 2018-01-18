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
