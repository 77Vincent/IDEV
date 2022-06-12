import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import 'normalize.css';
import { styled, ThemeProvider, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import Editor from './components/editor';
import FileExplorer from './components/explorer';
import Resizable from './components/resizable';
import StoreContext, { initState } from './context';
// import icon from '../../assets/icon.svg';
import './App.css';
import theme from './theme/theme';
import {
  SET_FILE_SESSIONS,
  ENTER_FULL_SCREEN,
  INIT,
  LEAVE_FULL_SCREEN,
  TOGGLE_MAXIMIZE,
  UPDATE_FILE_EXPLORER_WIDTH,
  EDITOR_REFRESH,
  CLOSE_FILE_SESSION,
} from './actions';

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
  const [fileExplorerWidth, setFileExplorerWidth] = useState(0);
  const [openFileUri, setOpenFileUri] = useState('');
  const [openFileContent, setOpenFileContent] = useState('');
  const [fileSessions, setFileSessions] = useState([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [cursorLine, setCursorLine] = useState(1);
  const [cursorCh, setCursorCh] = useState(1);
  const contextValue = {
    // settings
    fileExplorerWidth,
    setFileExplorerWidth,
    isFullScreen,
    // file sessions
    fileSessions,
    setFileSessions,
    // open file
    openFileUri,
    setOpenFileUri: (arg) => setOpenFileUri(arg || ''),
    openFileContent,
    setOpenFileContent: (arg) => setOpenFileContent(arg || ''),
    // cursor
    cursorLine,
    setCursorLine: (arg) => setCursorLine(arg || 1),
    cursorCh,
    setCursorCh: (arg) => setCursorCh(arg || 1),
  };
  useEffect(() => {
    // init
    window.electron.ipcRenderer.send(INIT, {});
    window.electron.ipcRenderer.on(INIT, (payload = initState) => {
      setFileSessions(payload.fileSessions);
      setOpenFileUri(payload.openFileUri);
      setOpenFileContent(payload.openFileContent);
      setCursorLine(payload.cursorLine);
      setCursorCh(payload.cursorCh);
      setIsFullScreen(payload.isFullScreen);
      setFileExplorerWidth(payload.fileExplorerWidth);
    });

    window.electron.ipcRenderer.on(ENTER_FULL_SCREEN, () => {
      setIsFullScreen(true);
    });
    window.electron.ipcRenderer.on(LEAVE_FULL_SCREEN, () => {
      setIsFullScreen(false);
    });
    window.electron.ipcRenderer.on(CLOSE_FILE_SESSION, () => {
      let uri = '';
      let content = '';
      let line = 1;
      let ch = 1;
      const len = fileSessions.length;
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
        const open = fileSessions[j];
        console.log(1111111111, open)
        uri = open.uri;
        content = open.content;
        line = open.cursorLine;
        ch = open.cursorCh;
      }

      setCursorLine(line);
      setCursorCh(ch);
      setOpenFileUri(uri);
      setOpenFileContent(content);
      setFileSessions(fileSessions);
    });

    window.electron.ipcRenderer.on(
      SET_FILE_SESSIONS,
      ({ fileSessions: fss }) => {
        setFileSessions([...fss]);
        const found = fss.find((v) => v.open) || {};
        if (found) {
          const { uri, content, cursorLine: line, cursorCh: ch } = found;
          setOpenFileUri(uri);
          setOpenFileContent(content);
          setCursorLine(line);
          setCursorCh(ch);
        }
      }
    );
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.send(UPDATE_FILE_EXPLORER_WIDTH, {
      width: fileExplorerWidth,
    });
  }, [fileExplorerWidth]);

  // monitor any change in open file session
  useEffect(() => {
    if (openFileUri !== '') {
      window.electron.ipcRenderer.send(EDITOR_REFRESH, {});
      // debouncedUpdateFileSessionsAction({
      //   uri: openFileUri,
      //   cursorPos,
      // });
    }
  }, [openFileUri]);

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
