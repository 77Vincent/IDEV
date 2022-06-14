import { ipcMain as main } from 'electron';

import {
  INIT,
  EDITOR_REFRESH,
  UPDATE_OPEN_FILE_URI,
  UPDATE_SETTINGS,
  TOGGLE_MAXIMIZE,
  SET_FILE_SESSIONS,
} from '../renderer/actions';
import {
  updateSettings,
  getSettings,
  setOpenFileUri,
  getOpenFileUri,
  freshFileSessions,
} from './dal';

function listener(win) {
  main.on(EDITOR_REFRESH, async (event) => {
    event.reply(EDITOR_REFRESH);
  });

  main.on(UPDATE_OPEN_FILE_URI, async (event, payload) => {
    setOpenFileUri(payload);
  });

  main.on(SET_FILE_SESSIONS, async (event, payload) => {
    console.log(7777777, payload[0].cursorCh);
    // patchFileSessions(payload);
  });

  main.on(UPDATE_SETTINGS, async (event, payload) => {
    await updateSettings(payload);
  });

  // when the window initiates
  main.on(INIT, async (event) => {
    const { fileSessions } = freshFileSessions();
    const { openFileUri } = getOpenFileUri();
    const { fileExplorerWidth } = getSettings();
    const isFullScreen = win.isFullScreen();
    event.reply(INIT, {
      // file sessions
      fileSessions,
      openFileUri,
      // settings
      isFullScreen,
      fileExplorerWidth,
    });
  });

  main.on(TOGGLE_MAXIMIZE, () => {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  });
}

export default listener;
