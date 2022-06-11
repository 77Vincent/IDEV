/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import storage from 'electron-json-storage';

import MenuBuilder from './menu';
import { isDarwin, resolveHtmlPath } from './util';
import listener from './listener';
import { enterFullScreen, leaveFullScreen } from './actions';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

const GLOBAL_TEMP_STORAGE = '.global-temp-storage';

storage.setDataPath(path.join(app.getPath('userData'), GLOBAL_TEMP_STORAGE));

// eslint-disable-next-line import/no-mutable-exports
export let win: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  win = new BrowserWindow({
    show: false,
    width: 1200,
    height: 800,
    icon: getAssetPath('icon.png'),
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  await win.loadURL(resolveHtmlPath('index.html'));

  win.on('ready-to-show', () => {
    if (!win) {
      throw new Error('"win" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      win.minimize();
    } else {
      win.show();
    }
  });

  win.on('enter-full-screen', () => {
    enterFullScreen(win);
  });
  win.on('leave-full-screen', () => {
    leaveFullScreen(win);
  });

  win.on('closed', () => {
    // if (isDarwin()) {
    //   console.log(33333333333333, win);
    //   win?.hide();
    // }
    win = null;
  });

  // register even listeners
  listener(win);
  // build menu
  const menuBuilder = new MenuBuilder(win);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  win.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (!isDarwin()) {
    app.quit();
  }
});

app
  .whenReady()
  .then(async () => {
    await createWindow();
    app.on('activate', async () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (win === null) {
        await createWindow();
      }
    });
  })
  .catch(console.log);
