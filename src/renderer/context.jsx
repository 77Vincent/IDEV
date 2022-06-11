import { createContext } from 'react';

export const initState = {
  isFullScreen: false,
  fileExplorerWidth: 100,
  setFileExplorerWidth: () => {},
  fileSessions: [],
  setFileSessions: () => {},
};

const StoreContext = createContext(initState);

export default StoreContext;
