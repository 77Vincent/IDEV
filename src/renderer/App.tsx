import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import 'normalize.css';
import { Box, ThemeProvider } from '@mui/material';
import { useEffect, useState } from 'react';

import Editor from './components/editor';
import Tabs from './components/tabs';
// import icon from '../../assets/icon.svg';
import './App.css';
import theme from './theme/theme';

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
      <Box
        overflow="hidden"
        flexDirection="column"
        height="100vh"
        display="flex"
        paddingTop={isFullScreen ? 0 : 4.2}
      >
        <Tabs />
        <Editor />
      </Box>
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
