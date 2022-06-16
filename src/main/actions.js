import { openFileSession } from './dal';
import {
  EDITOR_REFRESH,
  ENTER_FULL_SCREEN,
  LEAVE_FULL_SCREEN,
  EDITOR_FOCUS,
  SET_FILE_SESSIONS,
  GET_FILE_CONTENT,
  CLOSE_FILE_SESSION,
  NEXT_FILE,
  PREVIOUS_FILE,
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

export function nextFile(win) {
  win.webContents.send(NEXT_FILE);
}

export function previousFile(win) {
  win.webContents.send(PREVIOUS_FILE);
}

export function fileSessionsNavigate(win, next = true) {
  if (next) {
    win.webContents.send(NEXT_FILE);
  } else {
    win.webContents.send(PREVIOUS_FILE);
  }
}

function _editorFocus(win) {
  win.webContents.send(EDITOR_FOCUS);
}

export const editorFocus = debounce((win) => _editorFocus(win));

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
