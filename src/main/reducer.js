import { ipcMain } from 'electron';
import { readFileSync } from 'fs';

import {
  EDITOR_LOAD_FILE,
  RENDERER_UPDATE_OPEN_FILE_SESSION,
  RENDERER_UPDATE_FILE_SESSIONS,
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

ipcMain.on('RENDERER_RELOAD', async (event) => {
  const { fileSessions, openFileSession } = getFileSession();
  Object.keys(fileSessions).forEach((uri) => {
    const { content: cachedContent } = fileSessions[uri];
    const content = readFileSync(uri, 'utf-8');
    // not the actual file is newer, update cache
    if (cachedContent !== content) {
      fileSessions[uri].content = content;
    }
  });
  setFileSessions(fileSessions);
  Object.keys(fileSessions).forEach((uri) => {
    const { content, name } = fileSessions[uri];
    const payload = { uri, name, content };
    if (uri === openFileSession) {
      event.reply(EDITOR_LOAD_FILE, payload);
    }
    event.reply(RENDERER_UPDATE_FILE_SESSIONS, payload);
  });
  event.reply(RENDERER_UPDATE_OPEN_FILE_SESSION, { uri: openFileSession });
});
