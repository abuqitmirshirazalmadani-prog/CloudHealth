const { app, BrowserWindow, shell } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Load your deployed Vercel application
  win.loadURL('https://cloud-health-khaki.vercel.app/login');

  // Critical: For Google Authentication to work securely in a desktop app,
  // we must open external OAuth popups in the user's default system web browser.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.includes('accounts.google.com') || url.includes('oauth')) {
        shell.openExternal(url);
        return { action: 'deny' };
    }
    return { action: 'allow' };
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  // On macOS, it's common for apps to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
