import storage from 'electron-json-storage';
import { ipcMain } from 'electron';
import { readFileSync, writeFileSync } from 'fs';

import {
  EDITOR_LOAD_FILE,
  RENDERER_UPDATE_OPEN_FILE_SESSION,
  RENDERER_UPDATE_FILE_SESSIONS,
} from './actions';

ipcMain.on('MAIN_LOAD_FILE', async (event, { uri }) => {
  const fileSessions = storage.getSync('fileSessions');
  storage.set('openFileSession', { uri }, (e) => {
    if (e) {
      throw e;
    }
  });
  const { content } = fileSessions[uri];
  event.reply(EDITOR_LOAD_FILE, { content });
});

ipcMain.on('MAIN_SAVE_FILE', async (event, { content, name }) => {
  const { uri } = storage.getSync('openFileSession');
  const fileSessions = storage.getSync('fileSessions');
  fileSessions[uri].content = content;
  try {
    storage.set('fileSessions', fileSessions, (e) => {
      if (e) {
        throw e;
      }
    });
    writeFileSync(uri, content, 'utf-8');
  } catch (e) {
    console.log(e);
  }
});

ipcMain.on('RENDERER_RELOAD', async (event) => {
  const fileSessions = storage.getSync('fileSessions');
  Object.keys(fileSessions).forEach((uri) => {
    const { content: cachedContent } = fileSessions[uri];
    const content = readFileSync(uri, 'utf-8');
    // not the actual file is newer, update cache
    if (cachedContent !== content) {
      fileSessions[uri].content = content;
    }
  });
  storage.set('fileSessions', fileSessions, (e) => {
    if (e) {
      throw e;
    }
  });
  const { uri: openUri } = storage.getSync('openFileSession');
  Object.keys(fileSessions).forEach((uri) => {
    const { content, name } = fileSessions[uri];
    const payload = { uri, name, content };
    if (uri === openUri) {
      event.reply(EDITOR_LOAD_FILE, payload);
    }
    event.reply(RENDERER_UPDATE_FILE_SESSIONS, payload);
  });
  event.reply(RENDERER_UPDATE_OPEN_FILE_SESSION, { uri: openUri });
});
