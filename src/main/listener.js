import { ipcMain as main } from 'electron';

import {
  INIT,
  EDITOR_REFRESH,
  UPDATE_OPEN_FILE_URI,
  UPDATE_SETTINGS,
  TOGGLE_MAXIMIZE,
  PATCH_FILE_SESSIONS,
  SET_FILE_SESSIONS,
} from '../common/consts';
import {
  updateSettings,
  getSettings,
  setOpenFileUri,
  getOpenFileUri,
  getFileSessionsLatest,
  patchFileSessions,
  setFileSessions,
} from './dal';

function listener(win) {
  main.on(EDITOR_REFRESH, (event) => {
    event.reply(EDITOR_REFRESH);
  });

  main.on(UPDATE_OPEN_FILE_URI, (event, payload) => {
    setOpenFileUri(payload);
  });

  main.on(PATCH_FILE_SESSIONS, (event, payload) => {
    patchFileSessions(payload);
  });

  main.on(UPDATE_SETTINGS, (event, payload) => {
    updateSettings(payload);
  });

  main.on(SET_FILE_SESSIONS, (event, payload) => {
    setFileSessions({ fileSessions: payload });
  });

  // when the window initiates
  main.on(INIT, async (event) => {
    const { fileSessions } = getFileSessionsLatest();
    const { openFileUri } = getOpenFileUri();
    const { fileExplorerWidth, isFullScreen } = getSettings();
    if (isFullScreen) {
      win.setFullScreen(true);
    }
    event.reply(INIT, {
      fileSessions,
      openFileUri,
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
