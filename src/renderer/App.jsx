import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import 'normalize.css';
import { styled, ThemeProvider } from '@mui/material';
import { useEffect, useState } from 'react';

import Title from './components/title';
import Editor from './components/editor';
import FileExplorer from './components/explorer';
import Resizable from './components/resizable';
import StoreContext from './context';
// import icon from '../../assets/icon.svg';
import './App.css';
import theme from './theme/theme';
import {
  patchFileSessionsAction,
  setFileSessionsAction,
  triggerEditorRefreshAction,
  updateOpenFileUriAction,
  updateSettingsAction,
} from './actions';
import {
  SET_FILE_SESSIONS,
  ENTER_FULL_SCREEN,
  INIT,
  LEAVE_FULL_SCREEN,
  defaultFileExplorerWidth,
  defaultOpenFileUri,
  defaultFileSessions,
  defaultIsFullScreen,
  defaultCursorLine,
  defaultCursorCh,
  TITLE_SPACE,
  CLOSE_FILE_SESSION,
} from '../common/consts';

const Wrapper = styled('div')`
  display: flex;
  position: relative;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  user-select: none;
`;

const Main = () => {
  const [fileExplorerWidth, setFileExplorerWidth] = useState(
    defaultFileExplorerWidth
  );
  const [closingFileMonitor, setClosingFileMonitor] = useState(false);
  const [openFileUri, setOpenFileUri] = useState(defaultOpenFileUri);
  const [fileSessions, setFileSessions] = useState(defaultFileSessions);
  const [isFullScreen, setIsFullScreen] = useState(defaultIsFullScreen);
  const [cursorLine, setCursorLine] = useState(defaultCursorLine);
  const [cursorCh, setCursorCh] = useState(defaultCursorCh);

  const contextValue = {
    // settings
    fileExplorerWidth,
    setFileExplorerWidth: (arg) =>
      setFileExplorerWidth(arg || defaultFileExplorerWidth),
    isFullScreen,
    // file sessions
    fileSessions,
    setFileSessions: (arg) => setFileSessions(arg || defaultFileSessions),
    openFileUri,
    setOpenFileUri: (arg) => setOpenFileUri(arg || defaultOpenFileUri),
    // cursor
    cursorLine,
    setCursorLine: (arg) => setCursorLine(arg || defaultCursorLine),
    cursorCh,
    setCursorCh: (arg) => setCursorCh(arg || defaultCursorCh),
  };
  useEffect(() => {
    // init
    window.electron.ipcRenderer.send(INIT, {});
    window.electron.ipcRenderer.on(INIT, (payload) => {
      const {
        fileSessions: fss,
        openFileUri: ofu,
        isFullScreen: ifs,
        fileExplorerWidth: few,
      } = payload;
      setIsFullScreen(ifs);
      setFileExplorerWidth(few);
      setFileSessions(fss);
      setOpenFileUri(ofu);
    });
    window.electron.ipcRenderer.on(CLOSE_FILE_SESSION, () => {
      setClosingFileMonitor((prev) => !prev);
    });

    window.electron.ipcRenderer.on(ENTER_FULL_SCREEN, () => {
      setIsFullScreen(true);
    });
    window.electron.ipcRenderer.on(LEAVE_FULL_SCREEN, () => {
      setIsFullScreen(false);
    });

    window.electron.ipcRenderer.on(
      SET_FILE_SESSIONS,
      ({ fileSessions: fss, openFileUri: ofu, abort }) => {
        if (abort) {
          return;
        }
        setFileSessions(fss);
        // has to be the last one to trigger the refresh
        setOpenFileUri(ofu);
      }
    );
  }, []);

  // monitoring of closing file event
  useEffect(() => {
    // return if there is no new file opened
    if (!openFileUri) {
      return;
    }
    const len = fileSessions.length;
    let newOpenFileUri = '';
    let j = 0;
    for (let i = 0; i < len; i += 1) {
      const v = fileSessions[i];
      if (v.uri === openFileUri) {
        fileSessions.splice(i, 1);
        j = i;
        break;
      }
    }
    // load the sibling file only when there were more than 1 file before
    if (len > 1) {
      j = j === len - 1 ? j - 1 : j;
      newOpenFileUri = fileSessions[j].uri;
    }
    setFileSessionsAction(fileSessions);
    setFileSessions(fileSessions);
    setOpenFileUri(newOpenFileUri);
  }, [closingFileMonitor]);

  // when openFileUri changes, refresh the editor
  useEffect(() => {
    triggerEditorRefreshAction();
    if (openFileUri !== '') {
      updateOpenFileUriAction({ openFileUri });
    }
  }, [openFileUri]);

  // persisting settings
  useEffect(() => {
    updateSettingsAction({
      fileExplorerWidth,
      isFullScreen,
    });
  }, [fileExplorerWidth, isFullScreen]);

  useEffect(() => {
    patchFileSessionsAction({
      uri: openFileUri,
      cursorLine,
      cursorCh,
    });
  }, [cursorCh, cursorLine]);

  return (
    <ThemeProvider theme={theme}>
      <StoreContext.Provider value={contextValue}>
        <Wrapper
          style={{
            top: isFullScreen ? 0 : TITLE_SPACE,
            height: isFullScreen ? '100vh' : `calc(100vh - ${TITLE_SPACE}px)`,
          }}
        >
          <Title />
          <Resizable>
            <FileExplorer />
          </Resizable>
          <Editor />
        </Wrapper>
      </StoreContext.Provider>
    </ThemeProvider>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
      </Routes>
    </Router>
  );
}
