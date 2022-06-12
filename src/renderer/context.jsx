import { createContext } from 'react';

export const initState = {
  cursorLine: 1,
  cursorCh: 1,
  setCursorLine() {},
  setCursorCh() {},
  isFullScreen: false,
  fileExplorerWidth: 100,
  setFileExplorerWidth() {},
  fileSessions: [],
  setFileSessions() {},
  openFileUri: '',
  setOpenFileUri() {},
  openFileContent: '',
  setOpenFileContent() {},
};

const StoreContext = createContext(initState);

export default StoreContext;
