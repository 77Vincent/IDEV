import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import 'normalize.css';
import { styled, ThemeProvider } from '@mui/material';
import { useEffect, useState } from 'react';

import Editor from './components/editor';
// import icon from '../../assets/icon.svg';
import './App.css';
import theme from './theme/theme';

export const Wrapper = styled('div')`
  position: relative;
  top: 32px;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: calc(100vh - 32px);
  overflow: hidden;
`;

const Main = () => {
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

  return (
    <ThemeProvider theme={theme}>
      <Wrapper>
        <Editor />
      </Wrapper>
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
