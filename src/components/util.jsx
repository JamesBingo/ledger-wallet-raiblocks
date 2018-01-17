let logMsg = (message) => {
  if (process){ process.stdout.write(message); }
  if (console){ console.log(message); }
}

module.exports = {
  logMsg: logMsg
}
