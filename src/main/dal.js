import { promisify } from 'util';
import storage from 'electron-json-storage';
import { debounce } from './util';

const FILE_SESSIONS = 'fileSessions';
const SETTINGS = 'settings';

const storageSet = promisify(storage.set);

export function getFileSession() {
  const res = storage.getSync(FILE_SESSIONS);
  if (!res.fileSessions) {
    res.fileSessions = [];
  }
  return res;
}

export function getSettings() {
  const res = storage.getSync(SETTINGS);
  if (!res.fileExplorerWidth) {
    res.fileExplorerWidth = 200;
  }
  return res;
}

export async function patchSettings(payload = {}) {
  return storageSet(SETTINGS, payload);
}

export const debouncedPatchSettings = debounce(
  async (payload) => patchSettings(payload),
  100
);

export async function upsertFileSessions(
  payload = {
    uri: '',
    name: '',
    content: '',
  }
) {
  const { fileSessions } = getFileSession();
  let found = false;
  payload.open = true;
  for (let i = 0; i < fileSessions.length; i += 1) {
    const v = fileSessions[i];
    v.open = false;
    if (v.uri === payload.uri) {
      fileSessions[i] = payload;
      found = true;
    }
  }
  if (!found) {
    fileSessions.push(payload);
  }
  await storageSet(FILE_SESSIONS, { fileSessions });
  return { fileSessions };
}

export async function setFileSessions(payload = { fileSessions: [] }) {
  return storageSet(FILE_SESSIONS, payload);
}
