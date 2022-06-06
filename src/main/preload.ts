import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { ActionList } from './actions';

export type Channels = 'ipc-example' | ActionList;

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => ipcRenderer.removeListener(channel, subscription);
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
});
