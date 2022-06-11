import { debounce } from './util';

export const INIT = 'INIT';

export const PATCH_FILE_SESSIONS = 'PATCH_FILE_SESSIONS';
export const SET_FILE_SESSIONS = 'SET_FILE_SESSIONS';

export const EDITOR_LOAD_FILE = 'EDITOR_LOAD_FILE';
export const EDITOR_FOCUS = 'EDITOR_FOCUS';

export const ENTER_FULL_SCREEN = 'ENTER_FULL_SCREEN';
export const LEAVE_FULL_SCREEN = 'LEAVE_FULL_SCREEN';
export const TOGGLE_MAXIMIZE = 'TOGGLE_MAXIMIZE';

export const UPDATE_FILE_EXPLORER_WIDTH = 'UPDATE_FILE_EXPLORER_WIDTH';

export const GET_FILE_CONTENT = 'GET_FILE_CONTENT';

export const defaultFileSessionPayload = {
  uri: '',
  name: '',
  content: '',
  cursorPos: {
    line: 1,
    ch: 1,
  },
};

function updateFileSessionsAction(payload = defaultFileSessionPayload) {
  window.electron.ipcRenderer.send(PATCH_FILE_SESSIONS, payload);
}

export const debouncedUpdateFileSessionsAction = debounce(
  (payload) => updateFileSessionsAction(payload),
  500
);
