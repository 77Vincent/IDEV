import { getFileSession, upsertFileSessions, setFileSessions } from './dal';
import { debounce } from './util';

// renderer
export const INIT = 'INIT';
export const SET_FILE_SESSIONS = 'SET_FILE_SESSIONS';
export const ENTER_FULL_SCREEN = 'ENTER_FULL_SCREEN';
export const LEAVE_FULL_SCREEN = 'LEAVE_FULL_SCREEN';
export const GET_FILE_CONTENT = 'GET_FILE_CONTENT';
export const EDITOR_LOAD_FILE = 'EDITOR_LOAD_FILE';
export const EDITOR_FOCUS = 'EDITOR_FOCUS';

// main
export const MAIN_SAVE_FILE = 'MAIN_SAVE_FILE';
export const OPEN_DIRS = 'OPEN_DIRS';
export const NOTIFY = 'NOTIFY';

export function notify(win, payload = { code: 0, message: '' }) {
  win.webContents.send(NOTIFY, payload);
}

export function getFileContent(win) {
  win.webContents.send(GET_FILE_CONTENT);
}

export function enterFullScreen(win) {
  win.webContents.send(ENTER_FULL_SCREEN);
}

export function leaveFullScreen(win) {
  win.webContents.send(LEAVE_FULL_SCREEN);
}

export async function closeOpenFileSession(win) {
  const { fileSessions: fss } = getFileSession();
  const len = fss.length;
  let content = '';
  let uri = '';
  let j = 0;
  for (let i = 0; i < len; i += 1) {
    const v = fss[i];
    if (v.open === true) {
      fss.splice(i, 1);
      j = i;
      break;
    }
  }
  // load the sibling file only when there were more than 1 file before
  if (len > 1) {
    j = j === len - 1 ? j - 1 : j;
    fss[j].open = true;
    content = fss[j].content;
    uri = fss[j].uri;
  }
  // update local storage
  await setFileSessions({ fileSessions: fss });
  // update renderer
  win.webContents.send(SET_FILE_SESSIONS, { fileSessions: fss });
  win.webContents.send(EDITOR_LOAD_FILE, { content, uri });
}

async function fileSessionsNavigate(win, next = true) {
  const { fileSessions: fss } = getFileSession();
  const len = fss.length;
  let uri = '';
  let content = '';
  for (let i = 0; i < len; i += 1) {
    const v = fss[i];
    if (v.open === true) {
      // goto next file
      if (next) {
        if (i !== len - 1) {
          v.open = false;
          fss[i + 1].open = true;
          uri = fss[i + 1].uri;
          content = fss[i + 1].content;
        }
        break;
      }
      // goto previous file
      if (i !== 0) {
        v.open = false;
        fss[i - 1].open = true;
        uri = fss[i - 1].uri;
        content = fss[i - 1].content;
      }
      break;
    }
  }
  // only update when there is new file to be opened
  if (uri) {
    try {
      await setFileSessions({ fileSessions: fss });
    } catch (e) {
      return Promise.reject(e);
    }
    win.webContents.send(EDITOR_LOAD_FILE, { content, uri });
    win.webContents.send(SET_FILE_SESSIONS, { fileSessions: fss });
  }
  return Promise.resolve();
}

export function editorFocus(win) {
  win.webContents.send(EDITOR_FOCUS);
}

export const debouncedPreviousFile = debounce((win) =>
  fileSessionsNavigate(win, false)
);
export const debouncedNextFile = debounce((win) => fileSessionsNavigate(win));
export const debouncedEditorFocus = debounce((win) => editorFocus(win));

export async function openFiles(
  win,
  payload = { uri: '', name: '', content: '' }
) {
  const { content, uri } = payload;
  // update local storage
  const { fileSessions } = await upsertFileSessions(payload);
  // update renderer
  win.webContents.send(SET_FILE_SESSIONS, { fileSessions });
  win.webContents.send(EDITOR_LOAD_FILE, { content, uri });
}

export function openDirs(win, payload) {
  win.webContents.send(OPEN_DIRS, payload);
}
