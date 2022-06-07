import storage from 'electron-json-storage';
import { join } from 'path';
import { BrowserWindow } from 'electron';

export const RENDERER_UPDATE_FILE_SESSIONS = 'RENDERER_UPDATE_FILE_SESSIONS';
export const RENDERER_UPDATE_OPEN_FILE_SESSION =
  'RENDERER_UPDATE_OPEN_FILE_SESSION';
export const RENDERER_RELOAD = 'RENDERER_RELOAD';
export const RENDERER_CLOSE_OPEN_FILE_SESSION =
  'RENDERER_CLOSE_OPEN_FILE_SESSION';
export const RENDERER_GET_FILE_CONTENT = 'RENDERER_GET_FILE_CONTENT';
export const EDITOR_LOAD_FILE = 'EDITOR_LOAD_FILE';
export const MAIN_SAVE_FILE = 'MAIN_SAVE_FILE';
export const OPEN_DIRS = 'OPEN_DIRS';
export const NOTIFY = 'NOTIFY';

storage.setDataPath(join(__dirname, './.vimer'));

export type ActionList =
  | typeof EDITOR_LOAD_FILE
  | typeof RENDERER_UPDATE_FILE_SESSIONS
  | typeof RENDERER_CLOSE_OPEN_FILE_SESSION
  | typeof RENDERER_RELOAD
  | typeof RENDERER_GET_FILE_CONTENT
  | typeof MAIN_SAVE_FILE
  | typeof OPEN_DIRS;

export function notify(
  win: BrowserWindow,
  payload: { code: number; message: string }
) {
  win.webContents.send(NOTIFY, payload);
}

export function getFileContent(win: BrowserWindow) {
  win.webContents.send(RENDERER_GET_FILE_CONTENT);
}

export function closeOpenFileSession(win: BrowserWindow) {
  const fileSessions = storage.getSync('fileSessions');
  const { uri } = storage.getSync('openFileSession');
  let newUri = '';
  let newContent = '';
  Object.keys(fileSessions).forEach((key, index) => {
    if (uri === key) {
      if (index > 0) {
        newUri = Object.entries(fileSessions)[index - 1][0];
      }
    }
  });
  delete fileSessions[uri];
  if (newUri) {
    const { content } = fileSessions[newUri];
    newContent = content;
    win.webContents.send(RENDERER_UPDATE_OPEN_FILE_SESSION, { uri: newUri });
  }
  storage.set('openFileSession', { uri: newUri }, (e) => {
    if (e) {
      throw e;
    }
  });
  storage.set('fileSessions', fileSessions, (e) => {
    if (e) {
      throw e;
    }
  });
  win.webContents.send(RENDERER_CLOSE_OPEN_FILE_SESSION, { uri });
  win.webContents.send(EDITOR_LOAD_FILE, { content: newContent });
}

export function openFiles(
  win: BrowserWindow,
  payload: { name: string; uri: string; content: string }
) {
  const { name, uri, content } = payload;
  const fileSessions = storage.getSync('fileSessions');
  // set all file sessions
  storage.set(
    'fileSessions',
    Object.assign(fileSessions, {
      [uri]: {
        name,
        content,
      },
    }),
    (e) => {
      if (e) {
        throw e;
      }
    }
  );
  // set open file session
  storage.set('openFileSession', { uri }, (e) => {
    if (e) {
      throw e;
    }
  });
  // inform renderer
  win.webContents.send(RENDERER_UPDATE_FILE_SESSIONS, payload);
  win.webContents.send(RENDERER_UPDATE_OPEN_FILE_SESSION, { uri });
  win.webContents.send(EDITOR_LOAD_FILE, payload);
}

export function openDirs(
  win: BrowserWindow,
  payload: { name: string; pwd: string }[]
) {
  storage.set('open_dirs', payload, (e) => {
    if (e) {
      throw e;
    }
  });
  win.webContents.send(OPEN_DIRS, payload);
}
