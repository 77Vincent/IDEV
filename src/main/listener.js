import { ipcMain as main } from 'electron';
import { readFileSync } from 'fs';

import {
  EDITOR_LOAD_FILE,
  MAIN_SAVE_FILE,
  RENDERER_SET_FILE_SESSIONS,
  enterFullScreen,
  leaveFullScreen,
} from './actions';
import {
  debouncedPatchSettings,
  getFileSession,
  getSettings,
  setFileSessions,
} from './dal';

function listener(win) {
  main.on('MAIN_LOAD_FILE', async (event, { uri }) => {
    const { fileSessions } = getFileSession();
    for (let i = 0; i < fileSessions.length; i += 1) {
      const v = fileSessions[i];
      v.open = false;
      if (v.uri === uri) {
        v.open = true;
        event.reply(EDITOR_LOAD_FILE, { content: v.content });
      }
    }
    await setFileSessions({ fileSessions });
    event.reply(RENDERER_SET_FILE_SESSIONS, { fileSessions });
  });
  main.on('MAIN_UPDATE_FILE_EXPLORER_WIDTH', async (event, { width }) => {
    await debouncedPatchSettings({ fileExplorerWidth: width });
  });

  main.on(MAIN_SAVE_FILE, async (event, { content, name }) => {
    const { fileSessions, openFileSession } = getFileSession();
    fileSessions[openFileSession].content = content;
    await setFileSessions(fileSessions);
  });

  // when the window initiates
  main.on('INIT', async (event) => {
    const { fileSessions } = getFileSession();
    const { fileExplorerWidth } = getSettings();
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
        event.reply(EDITOR_LOAD_FILE, { content });
      }
    });
    if (changed) {
      await setFileSessions({ fileSessions });
    }
    const isFullScreen = win.isFullScreen();
    event.reply('INIT', { isFullScreen, fileSessions, fileExplorerWidth });
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
