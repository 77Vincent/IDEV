import { promisify } from 'util';
import storage from 'electron-json-storage';
import { debounce } from './util';

const FILE_SESSIONS = 'fileSessions';
const SETTINGS = 'settings';

const defaultFileSession = {
  uri: '',
  name: '',
  content: '',
  cursorLine: 1,
  cursorCh: 1,
};

const storageSet = promisify(storage.set);

export function getFileSessions() {
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

export async function patchFileSessions(payload = defaultFileSession) {
  const { uri } = payload;
  const { fileSessions: fss } = getFileSessions();
  for (let i = 0; i < fss.length; i += 1) {
    if (fss[i].uri === uri) {
      fss[i] = Object.assign(fss[i], payload);
      break;
    }
  }

  await storageSet(FILE_SESSIONS, { fileSessions: fss });
  return { fileSessions: fss };
}

// insert file session if not exists
export async function openFileSession(payload = defaultFileSession) {
  const { uri } = payload;
  const { fileSessions } = getFileSessions();
  // edge case, return if uri is zero value
  if (uri === '') {
    return { fileSessions };
  }
  let found = false;
  payload.open = true;
  for (let i = 0; i < fileSessions.length; i += 1) {
    const v = fileSessions[i];
    v.open = false;
    if (v.uri === uri) {
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

export const debouncedSetFileSessions = debounce(
  async (payload) => setFileSessions(payload),
  1000
);
