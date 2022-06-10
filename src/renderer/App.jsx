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

const TITLE_SPACE = 24;

const Wrapper = styled('div')`
  display: flex;
  position: relative;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
`;

const TitleWrapper = styled('div')`
  top: -${TITLE_SPACE}px;
  width: 100%;
  position: absolute;
  text-align: center;
`;

const Main = () => {
  const [fileExplorerWidth, setFileExplorerWidth] = useState(200);
  const [isFullScreen, setIsFullScreen] = useState(false);
  useEffect(() => {
    window.electron.ipcRenderer.send('RENDERER_RELOAD', {});
    window.electron.ipcRenderer.on('RENDERER_ENTER_FULL_SCREEN', () => {
      setIsFullScreen(true);
    });
    window.electron.ipcRenderer.on('RENDERER_LEAVE_FULL_SCREEN', () => {
      setIsFullScreen(false);
    });
  }, []);

  const Title = () => {
    return (
      <TitleWrapper>
        <Typography variant="body1">Vimer</Typography>
      </TitleWrapper>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <StoreContext.Provider
        value={{
          fileExplorerWidth,
          setFileExplorerWidth,
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