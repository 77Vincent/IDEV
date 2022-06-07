import storage from 'electron-json-storage';
import { ipcMain } from 'electron';

import {
  EDITOR_LOAD_FILE,
  RENDERER_UPDATE_OPEN_FILE_SESSION,
  RENDERER_UPDATE_FILE_SESSIONS,
} from './actions';

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

ipcMain.on('MAIN_LOAD_FILE', async (event, uri) => {
  const fileSessions = storage.getSync('fileSessions');
  storage.set('openFileSession', { uri }, (e) => {
    if (e) {
      throw e;
    }
  });
  const { content } = fileSessions[uri];
  event.reply(EDITOR_LOAD_FILE, { content });
});

ipcMain.on('RENDERER_RELOAD', async (event) => {
  const fileSessions = storage.getSync('fileSessions');
  const openFileSession = storage.getSync('openFileSession');
  const openUri = openFileSession.uri;
  Object.keys(fileSessions).forEach((uri) => {
    const { content, name } = fileSessions[uri];
    const payload = { uri, name, content };
    if (uri === openUri) {
      event.reply(EDITOR_LOAD_FILE, payload);
    }
    event.reply(RENDERER_UPDATE_FILE_SESSIONS, payload);
  });
  event.reply(RENDERER_UPDATE_OPEN_FILE_SESSION, openUri);
});
