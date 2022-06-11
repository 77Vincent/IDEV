import { createContext } from 'react';

export const initState = {
  fileExplorerWidth: 100,
  setFileExplorerWidth: () => {},
  fileSessions: [],
  setFileSessions: () => {},
};

const StoreContext = createContext(initState);

export default StoreContext;
