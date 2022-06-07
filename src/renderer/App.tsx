import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import 'normalize.css';
import { Box, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { green } from '@mui/material/colors';

import Editor from './components/editor';
import Tabs from './components/tabs';
// import icon from '../../assets/icon.svg';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: green[500],
    },
    secondary: {
      main: green[500],
    },
  },
});

const Hello = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box
        overflow="hidden"
        flexDirection="column"
        height="100vh"
        display="flex"
      >
        <Box zIndex={1} position="absolute" width="100%" height={24}>
          <Tabs />
        </Box>
        <Box overflow="auto" marginTop={3} flex={1}>
          <Editor />
        </Box>
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
