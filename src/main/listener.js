import { ipcMain as main } from 'electron';

import {
  INIT,
  EDITOR_REFRESH,
  UPDATE_OPEN_FILE_URI,
  UPDATE_SETTINGS,
  TOGGLE_MAXIMIZE,
  PATCH_FILE_SESSIONS,
} from '../common/consts';
import {
  updateSettings,
  getSettings,
  setOpenFileUri,
  getOpenFileUri,
  getFileSessionsLatest,
  patchFileSessions,
} from './dal';

function listener(win) {
  main.on(EDITOR_REFRESH, async (event) => {
    event.reply(EDITOR_REFRESH);
  });

  main.on(UPDATE_OPEN_FILE_URI, async (event, payload) => {
    setOpenFileUri(payload);
  });

  main.on(PATCH_FILE_SESSIONS, async (event, payload) => {
    patchFileSessions(payload);
  });

  main.on(UPDATE_SETTINGS, async (event, payload) => {
    await updateSettings(payload);
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
