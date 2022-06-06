import storage from 'electron-json-storage';
import { join } from 'path';
import { BrowserWindow } from 'electron';

export const OPEN_FILES = 'OPEN_FILES';
export const OPEN_DIRS = 'OPEN_DIRS';

storage.setDataPath(join(__dirname, './.vimer'));

export type ActionList = typeof OPEN_FILES | typeof OPEN_DIRS;

export function openFiles(
  win: BrowserWindow,
  payload: { name: string; uri: string; content: string }[]
) {
  win.webContents.send(OPEN_FILES, payload);
}

export function openDirs(
  win: BrowserWindow,
  payload: { name: string; pwd: string }[]
) {
  storage.set('open_dirs', payload, (e) => {
    if (e) {
      throw e;
    }
  });
  win.webContents.send(OPEN_DIRS, payload);
}
