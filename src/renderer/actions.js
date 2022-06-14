import { debounce } from '../common/util';
import {
  defaultFileSession,
  defaultSettings,
  PATCH_FILE_SESSIONS,
  SET_FILE_SESSIONS,
  UPDATE_OPEN_FILE_URI,
  UPDATE_SETTINGS,
} from '../common/consts';

function _setFileSessionsAction(payload = []) {
  window.electron.ipcRenderer.send(SET_FILE_SESSIONS, payload);
}

function _patchFileSessionsAction(payload = defaultFileSession) {
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
