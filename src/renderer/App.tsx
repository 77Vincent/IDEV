import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import 'normalize.css';
import { Box, ThemeProvider } from '@mui/material';
import { useEffect } from 'react';

import Editor from './components/editor';
import Tabs from './components/tabs';
// import icon from '../../assets/icon.svg';
import './App.css';
import theme from './theme/theme';

const Hello = () => {
  useEffect(() => {
    window.electron.ipcRenderer.send('RENDERER_RELOAD', {});
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box
        overflow="hidden"
        flexDirection="column"
        height="100vh"
        display="flex"
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
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
