'use strict'
const colors = require('colors')
const electron = require('electron')
const { app, BrowserWindow } = electron
const ledgerWorker = require('child_process').fork(`${__dirname}/ledger-async.js`)
const ipcMain = electron.ipcMain

// Let electron reloads by itself when webpack watches changes in ./app/
require('electron-reload')(__dirname)

// To avoid being garbage collected
let mainWindow;

// Linux 3d acceleration causes black screen for Electron-based apps, so turn it
// off
// see https://github.com/electron/electron/issues/4380 and
// https://github.com/electron/electron/issues/5297
process.platform === 'linux' ? app.disableHardwareAcceleration() : null


let createWindow = () => {
  // let mainWindow = new BrowserWindow({width: 1200, height: 600})
  //icon: iconpath,

  mainWindow = new electron.BrowserWindow({width: 1200, height: 600, center:true, resizable:true, frame:true, show:false})
  mainWindow.setContentProtection(true);
  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/client/app/index.html`)
  mainWindow.once('ready-to-show', () => mainWindow.show())


  mainWindow.webContents.openDevTools()
  mainWindow.loadURL(`file://${__dirname}/app/index.html`)

  ledgerWorker.on('message', obj => {
    mainWindow.webContents.send('ledgerSend', obj.value);
  })

  ipcMain.on('ledger', (event, args) => {
    console.log('a ledger message'.red);
  })

  mainWindow.on('closed', () => mainWindow = null)
}


// On OS X it is common for applications and their menu bar
// to stay active until the user quits explicitly with Cmd + Q
// if (process.platform !== 'darwin') {
app.on('window-all-closed', () => app.quit())
app.on('ready', () => createWindow())
