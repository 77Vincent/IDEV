import { BrowserWindow } from 'electron';
import { getFileSession, upsertFileSessions, setFileSessions } from './dal';

// renderer
export const RENDERER_SET_FILE_SESSIONS = 'RENDERER_SET_FILE_SESSIONS';
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

export async function closeOpenFileSession(win: BrowserWindow) {
  const { fileSessions } = getFileSession();
  const len = fileSessions.length;
  let content = '';
  let j = 0;
  for (let i = 0; i < len; i += 1) {
    const v = fileSessions[i];
    if (v.open === true) {
      fileSessions.splice(i, 1);
      j = i;
      break;
    }
  }
  // load the sibling file only when there were more than 1 file before
  if (len > 1) {
    j = j === len - 1 ? j - 1 : j;
    fileSessions[j].open = true;
    content = fileSessions[j].content;
  }
  // update local storage
  await setFileSessions({ fileSessions });
  // update renderer
  win.webContents.send(RENDERER_SET_FILE_SESSIONS, { fileSessions });
  win.webContents.send(EDITOR_LOAD_FILE, { content });
}

export async function previousFile(win: BrowserWindow) {
  const { fileSessions } = getFileSession();
  const len = fileSessions.length;
  let content = null;
  for (let i = 0; i < len; i += 1) {
    const v = fileSessions[i];
    if (v.open === true) {
      if (i !== 0) {
        v.open = false;
        fileSessions[i - 1].open = true;
        content = fileSessions[i - 1].content;
      }
      break;
    }
  }
  try {
    await setFileSessions({ fileSessions });
  } catch (e) {
    console.log(e);
    return Promise.reject();
  }
  if (content !== null) {
    win.webContents.send(EDITOR_LOAD_FILE, { content });
  }
  win.webContents.send(RENDERER_SET_FILE_SESSIONS, { fileSessions });
  return Promise.resolve();
}

export async function nextFile(win: BrowserWindow) {
  const { fileSessions } = getFileSession();
  const len = fileSessions.length;
  let content = null;
  for (let i = 0; i < len; i += 1) {
    const v = fileSessions[i];
    if (v.open === true) {
      if (i !== len - 1) {
        v.open = false;
        fileSessions[i + 1].open = true;
        content = fileSessions[i + 1].content;
      }
      break;
    }
  }
  try {
    await setFileSessions({ fileSessions });
  } catch (e) {
    console.log(e);
    return Promise.reject();
  }
  if (content !== null) {
    win.webContents.send(EDITOR_LOAD_FILE, { content });
  }
  win.webContents.send(RENDERER_SET_FILE_SESSIONS, { fileSessions });
  return Promise.resolve();
}

export function openFiles(
  win: BrowserWindow,
  payload: { name: string; uri: string; content: string }
) {
  const { content } = payload;
  // update local storage
  const { fileSessions } = upsertFileSessions(payload);
  // update renderer
  win.webContents.send(RENDERER_SET_FILE_SESSIONS, { fileSessions });
  win.webContents.send(EDITOR_LOAD_FILE, { content });
}

export function openDirs(
  win: BrowserWindow,
  payload: { name: string; pwd: string }[]
) {
  win.webContents.send(OPEN_DIRS, payload);
}
