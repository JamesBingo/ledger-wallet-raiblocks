(function () {

  const colors = require('colors')
  const ledger = require('ledgerco')
  const pollInterval = 2000

  let handleError = (error) => {
    ledgerRai.errorMessage = error
    send(ledgerRai)
  }

  let send = (device) => {
    process.send({action: 'LEDGER_CONNECTION', value: device})
  }

  let ledgerRai = {
    connected: false
  }

  let pollLedger = () => {
    ledgerRai.errorMessage = undefined

    ledger.comm_node.list_async().then(result => {
      ledgerRai.connected = result.length != 0
      ledgerRai.connected ? null : ledgerRai.deviceInfo = undefined
      send(ledgerRai)

      if (ledgerRai.connected) {
        ledger.comm_node.create_async().then(comm => {
          ledgerRai.deviceInfo = comm.device.getDeviceInfo()
          comm.device.close()
          send(ledgerRai)
        }).catch(error => handleError(error))
      }

    }).catch(error => handleError(error))
  }

  // let MainThreadRequestHandler = function (args) {
  //   console.log('handle request')
  // }
  // process.on('message', MainThreadRequestHandler)

  let pollTimer = setInterval(pollLedger, pollInterval)

})()
