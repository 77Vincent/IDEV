import storage from 'electron-json-storage';
import { join } from 'path';
import { BrowserWindow } from 'electron';

export const OPEN_FILES = 'OPEN_FILES';
export const OPEN_DIRS = 'OPEN_DIRS';
export const NOTIFY = 'NOTIFY';

storage.setDataPath(join(__dirname, './.vimer'));

export type ActionList = typeof OPEN_FILES | typeof OPEN_DIRS;

export function notify(
  win: BrowserWindow,
  payload: { code: number; message: string }
) {
  win.webContents.send(NOTIFY, payload);
}

export function openFiles(
  win: BrowserWindow,
  payload: { name: string; uri: string; content: string }[]
) {
  const { name, uri, content } = payload[0];
  const fileSessions = storage.getSync('fileSessions');
  storage.set(
    'fileSessions',
    Object.assign(fileSessions, {
      [uri]: {
        name,
        content,
      },
    }),
    (e) => {
      if (e) {
        throw e;
      }
    }
  );
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
