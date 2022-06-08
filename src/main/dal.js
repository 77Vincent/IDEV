import storage from 'electron-json-storage';

export function getFileSession() {
  const fileSessions = storage.getSync('fileSessions');
  const { uri } = storage.getSync('openFileSession');
  return {
    fileSessions,
    openFileSession: uri,
  };
}

export function setOpenFileSession(openFileSessions = '') {
  storage.set('openFileSession', { uri: openFileSessions }, (e) => {
    if (e) {
      throw e;
    }
  });
}

export function patchFileSessions(fileSession = {}) {
  const fileSessions = storage.getSync('fileSessions');
  storage.set('fileSessions', Object.assign(fileSessions, fileSession), (e) => {
    if (e) {
      throw e;
    }
  });
}

export function setFileSessions(fileSessions) {}
