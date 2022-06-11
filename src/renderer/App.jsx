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
  const [fileSessions, setFileSessions] = useState([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  useEffect(() => {
    // init
    window.electron.ipcRenderer.send('INIT', {});
    window.electron.ipcRenderer.on('INIT', (payload = initState) => {
      setIsFullScreen(payload.isFullScreen);
      setFileExplorerWidth(payload.fileExplorerWidth);
      setFileSessions(payload.fileSessions);
    });
    window.electron.ipcRenderer.on('ENTER_FULL_SCREEN', () => {
      setIsFullScreen(true);
    });
    window.electron.ipcRenderer.on('LEAVE_FULL_SCREEN', () => {
      setIsFullScreen(false);
    });
    window.electron.ipcRenderer.on(
      'SET_FILE_SESSIONS',
      ({ fileSessions: fileSessionsInput }) => {
        setFileSessions([...fileSessionsInput]);
      }
    );
  }, []);
  useEffect(() => {
    window.electron.ipcRenderer.send('MAIN_UPDATE_FILE_EXPLORER_WIDTH', {
      width: fileExplorerWidth,
    });
  }, [fileExplorerWidth]);

  const Title = () => {
    return (
      <TitleWrapper
        onDoubleClick={() =>
          window.electron.ipcRenderer.send('TOGGLE_MAXIMIZE', {})
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
      <StoreContext.Provider
        value={{
          fileExplorerWidth,
          setFileExplorerWidth,
          fileSessions,
          setFileSessions,
        }}
      >
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
