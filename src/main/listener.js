import { ipcMain as main } from 'electron';
import { readFileSync } from 'fs';

import {
  INIT,
  EDITOR_REFRESH,
  PATCH_FILE_SESSIONS,
  SET_FILE_SESSIONS,
} from '../renderer/actions';
import {
  debouncedPatchSettings,
  getFileSessions,
  getSettings,
  setFileSessions,
  patchFileSessions,
} from './dal';

function listener(win) {
  main.on(EDITOR_REFRESH, async (event, { uri }) => {
    const { fileSessions: fss } = getFileSessions();
    for (let i = 0; i < fss.length; i += 1) {
      const v = fss[i];
      v.open = false;
      if (v.uri === uri) {
        v.open = true;
        event.reply(EDITOR_REFRESH, v);
      }
    }
    await setFileSessions({ fileSessions: fss });
    event.reply(SET_FILE_SESSIONS, { fileSessions: fss });
  });

  main.on(PATCH_FILE_SESSIONS, async (event, payload) => {
    const { fileSessions } = await patchFileSessions(payload);
    win.webContents.send(SET_FILE_SESSIONS, { fileSessions });
  });

  main.on('UPDATE_FILE_EXPLORER_WIDTH', async (event, { width }) => {
    await debouncedPatchSettings({ fileExplorerWidth: width });
  });

  // main.on(MAIN_SAVE_FILE, async (event, { content, name }) => {
  //   const { fileSessions, openFileSession } = getFileSessions();
  //   fileSessions[openFileSession].content = content;
  //   await setFileSessions(fileSessions);
  // });

  // when the window initiates
  main.on(INIT, async (event) => {
    const { fileSessions } = getFileSessions();
    const { fileExplorerWidth } = getSettings();
    let openFileUri = '';
    let openFileContent = '';
    // check whether any file is changed
    let changed = false;
    fileSessions.forEach((v) => {
      const { uri, content } = v;
      const rawContent = readFileSync(uri, 'utf-8');
      // not the actual file is newer, update cache
      if (rawContent !== content) {
        v.content = rawContent;
        changed = true;
      }
      if (v.open) {
        openFileUri = v.uri;
        openFileContent = v.content;
        event.reply(EDITOR_REFRESH, v);
      }
    });
    if (changed) {
      await setFileSessions({ fileSessions });
    }
    const isFullScreen = win.isFullScreen();
    event.reply(INIT, {
      openFileUri,
      openFileContent,
      isFullScreen,
      fileSessions,
      fileExplorerWidth,
    });
  });

  main.on('TOGGLE_MAXIMIZE', () => {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  });
}

export default listener;
