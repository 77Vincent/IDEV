import { ipcMain } from 'electron';
import { readFileSync } from 'fs';

import {
  EDITOR_LOAD_FILE,
  RENDERER_UPDATE_OPEN_FILE_SESSION,
  RENDERER_UPDATE_FILE_SESSIONS,
  RENDERER_RELOAD,
  RENDERER_SET_FILE_SESSIONS,
} from './actions';
import { getFileSession, setFileSessions, setOpenFileSession } from './dal';

ipcMain.on('MAIN_LOAD_FILE', async (event, { uri }) => {
  const { fileSessions } = getFileSession();
  setOpenFileSession(uri);
  const { content } = fileSessions[uri];
  event.reply(EDITOR_LOAD_FILE, { content });
});

ipcMain.on('MAIN_SAVE_FILE', async (event, { content, name }) => {
  const { fileSessions, openFileSession } = getFileSession();
  fileSessions[openFileSession].content = content;
  setFileSessions(fileSessions);
});

ipcMain.on(RENDERER_RELOAD, async (event) => {
  const { fileSessions, openFileSession } = getFileSession();
  // check whether any file is changed
  let changed = false;
  const payload = {};
  Object.keys(fileSessions).forEach((uri) => {
    const { content: cachedContent, name } = fileSessions[uri];
    const content = readFileSync(uri, 'utf-8');
    payload[uri] = name;
    // not the actual file is newer, update cache
    if (cachedContent !== content) {
      changed = true;
      fileSessions[uri].content = content;
    }
  });
  if (changed) {
    setFileSessions(fileSessions);
  }
  // update renderer
  const { content } = fileSessions[openFileSession];
  event.reply(EDITOR_LOAD_FILE, { content });
  event.reply(RENDERER_SET_FILE_SESSIONS, payload);
  event.reply(RENDERER_UPDATE_OPEN_FILE_SESSION, { uri: openFileSession });
});
