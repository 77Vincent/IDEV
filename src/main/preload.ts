import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { ActionList } from './actions';

export type Channels = 'ipc-example' | ActionList;

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send(channel: Channels, args: object) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (args: object) => void) {
      const subscription = (_event: IpcRendererEvent, args: object) =>
        func(args);
      ipcRenderer.on(channel, subscription);

      return () => ipcRenderer.removeListener(channel, subscription);
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
});
