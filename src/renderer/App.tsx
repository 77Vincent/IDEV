import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import 'normalize.css';
import { Box } from '@mui/material';

import Editor from './components/editor';
import Tabs from './components/tabs';
// import icon from '../../assets/icon.svg';
import './App.css';

const Hello = () => {
  return (
    <>
      <Box flexDirection="column" height="100vh" display="flex">
        <Box>
          <Tabs />
        </Box>

        <Box flex={1}>
          <Editor />
        </Box>
      </Box>
    </>
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
