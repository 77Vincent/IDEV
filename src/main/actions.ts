import { BrowserWindow } from 'electron';
import {
  getFileSession,
  patchFileSessions,
  setFileSessions,
  setOpenFileSession,
} from './dal';

// renderer
export const RENDERER_UPDATE_FILE_SESSIONS = 'RENDERER_UPDATE_FILE_SESSIONS';
export const RENDERER_SET_FILE_SESSIONS = 'RENDERER_SET_FILE_SESSIONS';
export const RENDERER_UPDATE_OPEN_FILE_SESSION =
  'RENDERER_UPDATE_OPEN_FILE_SESSION';
export const RENDERER_RELOAD = 'RENDERER_RELOAD';
export const RENDERER_CLOSE_OPEN_FILE_SESSION =
  'RENDERER_CLOSE_OPEN_FILE_SESSION';
export const RENDERER_GET_FILE_CONTENT = 'RENDERER_GET_FILE_CONTENT';
export const EDITOR_LOAD_FILE = 'EDITOR_LOAD_FILE';

// main
export const MAIN_SAVE_FILE = 'MAIN_SAVE_FILE';
export const OPEN_DIRS = 'OPEN_DIRS';
export const NOTIFY = 'NOTIFY';

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
  const { fileSessions, openFileSession } = getFileSession();
  let newUri = '';
  let newContent = '';
  // delete from session
  delete fileSessions[openFileSession];
  // get the new last session and set it as the open file session
  const l = Object.keys(fileSessions).length - 1;
  if (l > 0) {
    newUri = Object.entries(fileSessions)[l - 1][0];
  }
  if (newUri) {
    const { content } = fileSessions[newUri];
    newContent = content;
    win.webContents.send(RENDERER_UPDATE_OPEN_FILE_SESSION, { uri: newUri });
  }
  setOpenFileSession(newUri);
  setFileSessions(fileSessions);
  win.webContents.send(RENDERER_CLOSE_OPEN_FILE_SESSION, {
    uri: openFileSession,
  });
  win.webContents.send(EDITOR_LOAD_FILE, { content: newContent });
}

export function openFiles(
  win: BrowserWindow,
  payload: { name: string; uri: string; content: string }
) {
  const { uri, name, content } = payload;
  patchFileSessions({
    [uri]: {
      name,
      content,
    },
  });
  setOpenFileSession(uri);
  win.webContents.send(RENDERER_UPDATE_FILE_SESSIONS, payload);
  win.webContents.send(RENDERER_UPDATE_OPEN_FILE_SESSION, { uri });
  win.webContents.send(EDITOR_LOAD_FILE, payload);
}

export function openDirs(
  win: BrowserWindow,
  payload: { name: string; pwd: string }[]
) {
  win.webContents.send(OPEN_DIRS, payload);
}
