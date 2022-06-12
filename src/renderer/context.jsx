import { createContext } from 'react';

export const initState = {
  cursorPos: {
    line: 1,
    ch: 1,
  },
  setCursorPos() {},
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

const StoreContext = createContext();

export default StoreContext;
