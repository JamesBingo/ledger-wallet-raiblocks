var ipcRenderer = require('electron').ipcRenderer

ipcRenderer.on('ledgerSend', function (event, ledgerData) {
  let payload = { detail: ledgerData }
  var event = new CustomEvent('ledger', payload)
  window.dispatchEvent(event)
});
