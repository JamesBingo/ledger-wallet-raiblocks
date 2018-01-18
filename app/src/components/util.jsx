let logMsg = (message) => {
  if (process.stdout){ process.stdout.write(message); }
  if (console){ console.log(message); }
}

export default logMsg
