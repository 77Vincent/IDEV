// action flags
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

// default state
export const defaultCursorLine = 0;
export const defaultCursorCh = 0;
export const defaultIsFullScreen = false;
export const defaultFileExplorerWidth = 200;
export const defaultFileSessions = [];
export const defaultOpenFileUri = '';
export const defaultOpenFileContent = '';
export const defaultFileSession = {
  uri: '',
  name: '',
  content: '',
  cursorLine: 0,
  cursorCh: 0,
};
export const defaultSettings = {
  fileExplorerWidth: 200,
  isFullScreen: false,
};
