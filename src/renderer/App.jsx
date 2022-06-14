import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import 'normalize.css';
import { styled, ThemeProvider, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import Editor from './components/editor';
import FileExplorer from './components/explorer';
import Resizable from './components/resizable';
import StoreContext from './context';
// import icon from '../../assets/icon.svg';
import './App.css';
import theme from './theme/theme';
import {
  setFileSessionsAction,
  updateOpenFileUriAction,
  updateSettingsAction,
} from './actions';
import {
  SET_FILE_SESSIONS,
  ENTER_FULL_SCREEN,
  INIT,
  LEAVE_FULL_SCREEN,
  TOGGLE_MAXIMIZE,
  EDITOR_REFRESH,
  defaultFileExplorerWidth,
  defaultOpenFileUri,
  defaultFileSessions,
  defaultIsFullScreen,
  defaultCursorLine,
  defaultCursorCh,
  defaultOpenFileContent,
} from '../common/consts';

const TITLE_SPACE = 24;

const Wrapper = styled('div')`
  display: flex;
  position: relative;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  user-select: none;
`;

const TitleWrapper = styled('div')`
  top: -${TITLE_SPACE}px;
  width: 100%;
  position: absolute;
  text-align: center;
  app-region: drag;
`;

const Main = () => {
  const [fileExplorerWidth, setFileExplorerWidth] = useState(
    defaultFileExplorerWidth
  );
  const [openFileUri, setOpenFileUri] = useState(defaultOpenFileUri);
  const [openFileContent, setOpenFileContent] = useState(
    defaultOpenFileContent
  );
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
    // open file
    openFileUri,
    setOpenFileUri: (arg) => setOpenFileUri(arg || defaultOpenFileUri),
    openFileContent,
    setOpenFileContent: (arg) =>
      setOpenFileContent(arg || defaultOpenFileContent),
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
      setFileSessions(fss);
      setOpenFileUri(ofu);
      setIsFullScreen(ifs);
      setFileExplorerWidth(few);

      // set dependent values
      for (let i = 0; i < fss.length; i += 1) {
        const v = fss[i];
        if (v.uri === ofu) {
          setOpenFileContent(v.content);
          setCursorLine(v.cursorLine);
          setCursorCh(v.cursorCh);
          break;
        }
      }
    });

    window.electron.ipcRenderer.on(ENTER_FULL_SCREEN, () => {
      setIsFullScreen(true);
    });
    window.electron.ipcRenderer.on(LEAVE_FULL_SCREEN, () => {
      setIsFullScreen(false);
    });

    window.electron.ipcRenderer.on(
      SET_FILE_SESSIONS,
      ({ fileSessions: fss, openFileUri: ofu }) => {
        setFileSessions(fss);
        const found = fss.find((v) => v.uri === ofu) || {};
        setOpenFileUri(ofu);
        setOpenFileContent(found.content);
        setCursorLine(found.cursorLine);
        setCursorCh(found.cursorCh);
      }
    );
  }, []);

  useEffect(() => {
    setFileSessionsAction(fileSessions);
  }, [fileSessions, cursorLine, cursorCh]);

  // when openFileUri changes, refresh the editor
  useEffect(() => {
    if (openFileUri !== '') {
      window.electron.ipcRenderer.send(EDITOR_REFRESH, {});
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

  const Title = () => {
    return (
      <TitleWrapper
        onDoubleClick={() =>
          window.electron.ipcRenderer.send(TOGGLE_MAXIMIZE, {})
        }
      >
        <Typography fontWeight={700} variant="body2">
          Vimer
        </Typography>
      </TitleWrapper>
    );
  };

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
