import storage from 'electron-json-storage';
import { readFileSync } from 'fs';

import {
  defaultFileSession,
  defaultFileSessions,
  defaultOpenFileUri,
  defaultSettings,
} from '../common/consts';

const FILE_SESSIONS = 'fileSessions';
const SETTINGS = 'settings';
const OPEN_FILE_URI = 'openFileUri';

export function getFileSessions() {
  const res = storage.getSync(FILE_SESSIONS);
  return { fileSessions: defaultFileSessions, ...res };
}

export function getFileSessionsLatest() {
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
    setFileSessions({ fileSessions });
  }
  return { fileSessions };
}

export function getOpenFileUri() {
  const res = storage.getSync(OPEN_FILE_URI);
  return { openFileUri: defaultOpenFileUri, ...res };
}

export function getSettings() {
  const res = storage.getSync(SETTINGS);
  return Object.assign(defaultSettings, res);
}

export function updateSettings(payload = defaultSettings) {
  storage.set(SETTINGS, payload, (e) => {
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
export function openFileSession(payload = defaultFileSession) {
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
    storage.set(FILE_SESSIONS, { fileSessions }, (e) => {
      if (e) {
        throw e;
      }
    });
  }
  storage.set(OPEN_FILE_URI, uri, (e) => {
    if (e) {
      throw e;
    }
  });
  return { fileSessions };
}

export function setOpenFileUri(payload = { openFileUri: defaultOpenFileUri }) {
  return storage.set(OPEN_FILE_URI, payload, (e) => {
    if (e) {
      throw e;
    }
  });
}

export function setFileSessions(
  payload = { fileSessions: defaultFileSessions }
) {
  return storage.set(FILE_SESSIONS, payload, (e) => {
    if (e) {
      throw e;
    }
  });
}
