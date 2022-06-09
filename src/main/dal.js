import { promisify } from 'util';
import storage from 'electron-json-storage';

const FILE_SESSIONS = 'fileSessions';

const storageSet = promisify(storage.set);

export function getFileSession() {
  const res = storage.getSync(FILE_SESSIONS);
  if (!res.fileSessions) {
    res.fileSessions = [];
  }
  return res;
}

export function upsertFileSessions(payload = {}) {
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
  storage.set(FILE_SESSIONS, { fileSessions }, (e) => {
    if (e) {
      throw e;
    }
  });
  return { fileSessions };
}

export async function setFileSessions(payload = { fileSessions: [] }) {
  return storageSet(FILE_SESSIONS, payload);
}
