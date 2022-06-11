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
};

const StoreContext = createContext(initState);

export default StoreContext;
