'use strict';
const electron = require('electron');
const { app, BrowserWindow } = electron;
const ledgerWorker = require('child_process').fork(`${__dirname}/ledger-async.js`);
const ipcMain = electron.ipcMain;

// Let electron reloads by itself when webpack watches changes in ./app/
require('electron-reload')(__dirname);

// To avoid being garbage collected
let mainWindow;

// Linux 3d acceleration causes black screen for Electron-based apps, so turn it
// off
// see https://github.com/electron/electron/issues/4380 and
// https://github.com/electron/electron/issues/5297
process.platform === 'linux' ? app.disableHardwareAcceleration() : null;

// On OS X it is common for applications and their menu bar
// to stay active until the user quits explicitly with Cmd + Q
// if (process.platform !== 'darwin') {
app.on('window-all-closed', () => app.quit());

app.on('ready', () => {
  let mainWindow = new BrowserWindow({width: 1200, height: 600});
  mainWindow.loadURL(`file://${__dirname}/app/index.html`);
  mainWindow.webContents.openDevTools();
  mainWindow.on('closed', () => mainWindow = null);
});


ledgerWorker.on('message', args => {
  // todo
})

ipcMain.on('ledger', (event, args) => {
  // todo
})