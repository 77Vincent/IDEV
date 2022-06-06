import { Box } from '@mui/material';
import { useEffect, useState } from 'react';

export default () => {
  const [openFileSession, setOpenFileSession] = useState('');
  const [fileSessions, setFileSessions] = useState({});

  useEffect(() => {
    window.electron.ipcRenderer.on('OPEN_FILES', (args) => {
      const { name, uri } = args[0];
      setFileSessions((prevState) => {
        return Object.assign(prevState, { [uri]: name });
      });
      setOpenFileSession(uri);
    });
  }, []);

  return (
    <Box>
      {Object.keys(fileSessions).map((key) => {
        return <div key={key}>{fileSessions[key]}</div>;
      })}
    </Box>
  );
};
