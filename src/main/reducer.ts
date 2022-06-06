import storage from 'electron-json-storage';
import { ipcMain } from 'electron';

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

ipcMain.on('LOAD_FILE', async (event, arg) => {
  const fileSessions = storage.getSync('fileSessions');
  const { content } = fileSessions[arg[0]];
  event.reply('EDITOR_LOAD_FILE', [{ content }]);
});
