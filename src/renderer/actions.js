import { debounce } from './util';

export const INIT = 'INIT';

export const PATCH_FILE_SESSIONS = 'PATCH_FILE_SESSIONS';
export const SET_FILE_SESSIONS = 'SET_FILE_SESSIONS';
export const UPDATE_OPEN_FILE_URI = 'UPDATE_OPEN_FILE_URI';

export const EDITOR_REFRESH = 'EDITOR_REFRESH';
export const EDITOR_FOCUS = 'EDITOR_FOCUS';

export const ENTER_FULL_SCREEN = 'ENTER_FULL_SCREEN';
export const LEAVE_FULL_SCREEN = 'LEAVE_FULL_SCREEN';
export const TOGGLE_MAXIMIZE = 'TOGGLE_MAXIMIZE';

export const UPDATE_SETTINGS = 'UPDATE_SETTINGS';

export const GET_FILE_CONTENT = 'GET_FILE_CONTENT';

export const defaultFileSessionPayload = {
  uri: '',
  name: '',
  content: '',
  cursorLine: 1,
  cursorCh: 1,
};

export const defaultSettings = {
  fileExplorerWidth: 200,
  isFullScreen: false,
};

function _setFileSessionsAction(payload = []) {
  window.electron.ipcRenderer.send(SET_FILE_SESSIONS, payload);
}

function _patchFileSessionsAction(payload = defaultFileSessionPayload) {
  window.electron.ipcRenderer.send(PATCH_FILE_SESSIONS, payload);
}

function _updateOpenFileUriAction(payload) {
  window.electron.ipcRenderer.send(UPDATE_OPEN_FILE_URI, payload);
}

function _updateSettingsAction(payload = defaultSettings) {
  window.electron.ipcRenderer.send(UPDATE_SETTINGS, payload);
}

export const updateOpenFileUriAction = debounce(_updateOpenFileUriAction, 500);
export const updateSettingsAction = debounce(_updateSettingsAction, 1000);
export const patchFileSessionsAction = debounce(_patchFileSessionsAction, 500);
export const setFileSessionsAction = debounce(_setFileSessionsAction, 500);
