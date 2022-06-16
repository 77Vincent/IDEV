import { openFileSession } from './dal';
import {
  EDITOR_REFRESH,
  ENTER_FULL_SCREEN,
  LEAVE_FULL_SCREEN,
  EDITOR_FOCUS,
  SET_FILE_SESSIONS,
  GET_FILE_CONTENT,
  CLOSE_FILE_SESSION,
} from '../common/consts';
import { debounce } from '../common/util';

export function getFileContent(win) {
  win.webContents.send(GET_FILE_CONTENT);
}

export function enterFullScreen(win) {
  win.webContents.send(ENTER_FULL_SCREEN);
}

export function leaveFullScreen(win) {
  win.webContents.send(LEAVE_FULL_SCREEN);
}

export function closeOpenFileSession(win) {
  win.webContents.send(CLOSE_FILE_SESSION);
}

async function fileSessionsNavigate(win, next = true) {
  // const { fileSessions: fss } = getFileSessions();
  // const len = fss.length;
  // let uri = '';
  // let j = 0;
  // for (let i = 0; i < len; i += 1) {
  //   const v = fss[i];
  //   if (v.open === true) {
  //     // goto next file
  //     if (next) {
  //       if (i !== len - 1) {
  //         v.open = false;
  //         j = i + 1;
  //         fss[j].open = true;
  //         uri = fss[j].uri;
  //       }
  //       break;
  //     }
  //     // goto previous file
  //     if (i !== 0) {
  //       v.open = false;
  //       j = i - 1;
  //       fss[j].open = true;
  //       uri = fss[j].uri;
  //     }
  //     break;
  //   }
  // }
  // only update when there is new file to be opened
  // win.webContents.send(EDITOR_REFRESH, fss[j]);
  // win.webContents.send(SET_FILE_SESSIONS, { fileSessions: fss });
  // if (uri) {
  //   try {
  //     debouncedSetFileSessions({ fileSessions: fss });
  //   } catch (e) {
  //     return Promise.reject(e);
  //   }
  // }
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
  // update local storage
  const { uri: openFileUri } = payload;
  const { fileSessions } = openFileSession(payload);
  // update renderer
  win.webContents.send(SET_FILE_SESSIONS, { fileSessions, openFileUri });
  win.webContents.send(EDITOR_REFRESH);
}
