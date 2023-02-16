const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  Minimize() {
    ipcRenderer.send('window-minimize')
  },

  Hide() {
    ipcRenderer.send('window-hide') 
  },

  Open() {
    ipcRenderer.send('window-open') 
  },
})