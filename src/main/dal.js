import storage from 'electron-json-storage';

const FILE_SESSIONS = 'fileSessions';
const OPEN_FILE_SESSION = 'openFileSession';

export function getFileSession() {
  const fileSessions = storage.getSync('fileSessions');
  const { uri } = storage.getSync('openFileSession');
  return {
    fileSessions,
    openFileSession: uri,
  };
}

export function setOpenFileSession(openFileSession = '') {
  storage.set(OPEN_FILE_SESSION, { uri: openFileSession }, (e) => {
    if (e) {
      throw e;
    }
  });
}

export function patchFileSessions(fileSession = {}) {
  const fileSessions = storage.getSync(FILE_SESSIONS);
  storage.set(FILE_SESSIONS, Object.assign(fileSessions, fileSession), (e) => {
    if (e) {
      throw e;
    }
  });
}

export function setFileSessions(fileSessions) {}
