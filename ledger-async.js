"use strict";

const LEDGER = require('ledgerco')

LEDGER.comm_node.list_async().then(result => {
  if (result.length == 0) {
    process.stdout.write('NO LEDGER CONNECTED \n');
  } else {
    process.stdout.write('WE HAVE A LEDGER \n');
  }
}).catch((error) => {
  process.stdout.write('ERROR FETCHING LEDGER LIST \n');
})
