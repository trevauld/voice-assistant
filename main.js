const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,             // Double launch width
    height: 900,
    minWidth: 600,          // Minimum resizable threshold
    minHeight: 500,
    resizable: true,        // Native border dragging
    movable: true,
    minimizable: true,
    maximizable: true,
    fullscreenable: true,
    frame: true,            // Native OS window frame for Aero Snap / Docking
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
