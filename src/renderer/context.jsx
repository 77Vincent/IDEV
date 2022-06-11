import { createContext } from 'react';

const StoreContext = createContext({
  fileExplorerWidth: 100,
  setFileExplorerWidth: () => {},
  fileSessions: [],
  setFileSessions: () => {},
});

export default StoreContext;
