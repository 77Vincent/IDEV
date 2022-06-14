import { promisify } from 'util';
import storage from 'electron-json-storage';
import { debounce } from './util';
import { readFileSync } from 'fs';

const FILE_SESSIONS = 'fileSessions';
const SETTINGS = 'settings';
const OPEN_FILE_URI = 'openFileUri';

const defaultFileSession = {
  uri: '',
  name: '',
  content: '',
  cursorLine: 1,
  cursorCh: 1,
};

const defaultFileSessions = {
  fileSessions: [],
};

const defaultOpenFileUri = {
  openFileUri: '',
};

const defaultSettings = {
  fileExplorerWidth: 200,
  isFullScreen: false,
};

const storageSet = promisify(storage.set);

export function getFileSessions() {
  const res = storage.getSync(FILE_SESSIONS);
  return Object.assign(defaultFileSessions, res);
}

export function freshFileSessions() {
  const { fileSessions } = getFileSessions();
  let changed = false;
  fileSessions.forEach((v) => {
    const { uri, content } = v;
    const rawContent = readFileSync(uri, 'utf-8');
    // not the actual file is newer, update cache
    if (rawContent !== content) {
      v.content = rawContent;
      changed = true;
    }
  });
  if (changed) {
    setFileSessions(fileSessions);
  }
  return { fileSessions };
}

export function getOpenFileUri() {
  const res = storage.getSync(OPEN_FILE_URI);
  return Object.assign(defaultOpenFileUri, res);
}

export function getSettings() {
  const res = storage.getSync(SETTINGS);
  return Object.assign(defaultSettings, res);
}

export async function updateSettings(payload = defaultSettings) {
  return storage.set(SETTINGS, payload, (e) => {
    if (e) {
      console.log(e);
    }
  });
}

// update an existing file session
export function patchFileSessions(payload = defaultFileSession) {
  const { uri } = payload;
  const { fileSessions: fss } = getFileSessions();
  for (let i = 0; i < fss.length; i += 1) {
    if (fss[i].uri === uri) {
      fss[i] = Object.assign(fss[i], payload);
      break;
    }
  }

  storage.set(FILE_SESSIONS, { fileSessions: fss }, (e) => {
    if (e) {
      throw e;
    }
  });
  return { fileSessions: fss };
}

// insert file session if not exists
// and only updating the openFileUri if no new file is opened
export async function openFileSession(payload = defaultFileSession) {
  const { uri } = payload;
  const { fileSessions } = getFileSessions();
  // edge case, return if uri is zero value
  if (uri === '') {
    return { fileSessions };
  }
  let found = false;
  for (let i = 0; i < fileSessions.length; i += 1) {
    const v = fileSessions[i];
    if (v.uri === uri) {
      found = true;
      break;
    }
  }
  if (!found) {
    fileSessions.push(payload);
    await storageSet(FILE_SESSIONS, { fileSessions });
  }
  storage.set(OPEN_FILE_URI, uri, (e) => {
    if (e) {
      throw e;
    }
  });
  return { fileSessions };
}

export function setOpenFileUri(payload = defaultOpenFileUri) {
  return storage.set(OPEN_FILE_URI, payload, (e) => {
    if (e) {
      throw e;
    }
  });
}

export function setFileSessions(payload = defaultFileSessions) {
  return storage.set(FILE_SESSIONS, payload, (e) => {
    if (e) {
      throw e;
    }
  });
}

export const debouncedSetFileSessions = debounce(
  async (payload) => setFileSessions(payload),
  1000
);
