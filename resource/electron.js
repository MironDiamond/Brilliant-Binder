const {app, BrowserWindow, ipcMain, Tray} = require('electron')
const path = require('path')

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 700,

    frame: false,
    resizable: false,
    show: true,

    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    },
    
    icon: __dirname + '/img/logo.ico',
  })

  mainWindow.loadURL('http://localhost:8888/index.html')

  // mainWindow.setAlwaysOnTop(true)

  ipcMain.on('window-minimize', (event) => {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    
    win.minimize()
  })

  ipcMain.on('window-open', (event) => {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    
    win.show();
  })

  ipcMain.on('window-hide', (event) => {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    mainWindow.webContents.executeJavaScript("Play(true)");
    win.hide()
  })

  let tray = new Tray(__dirname + '/img/logo.ico')

  tray.on('click', function () {
    mainWindow.webContents.executeJavaScript("Play(false)");
    mainWindow.show();
  })
}

app.on('ready', createWindow)

app.whenReady().then(() => {
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})