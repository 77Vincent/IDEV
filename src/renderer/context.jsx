import { createContext } from 'react';

const StoreContext = createContext({
  fileExplorerWidth: 100,
  setFileExplorerWidth: () => {},
});

export default StoreContext;
