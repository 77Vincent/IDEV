import { Box, styled, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

const ActiveTab = styled('div')(({ theme }) => {
  return {
    borderBottomColor: theme.palette.primary.main,
    borderBottomWidth: 3,
    borderBottomStyle: 'solid',
  };
});

export default () => {
  const [openFileSession, setOpenFileSession] = useState('');
  const [fileSessions, setFileSessions] = useState({});

  useEffect(() => {
    window.electron.ipcRenderer.on('RENDERER_OPEN_FILE', (args) => {
      const { name, uri } = args[0];
      setFileSessions((prevState) => {
        return Object.assign(prevState, { [uri]: name });
      });
      setOpenFileSession(uri);
    });
  }, []);

  const Tab = ({ name, uri }) => {
    return (
      <Box
        onClick={() => {
          setOpenFileSession(uri);
          window.electron.ipcRenderer.send('MAIN_LOAD_FILE', [uri]);
        }}
        paddingLeft={1}
        paddingRight={1}
      >
        <Typography variant="body2">{name}</Typography>
      </Box>
    );
  };

  return (
    <Box display="flex">
      {Object.keys(fileSessions).map((key) => {
        const file = fileSessions[key];
        return (
          <div key={key}>
            {openFileSession === key ? (
              <ActiveTab>
                <Tab uri={key} name={file} />
              </ActiveTab>
            ) : (
              <Tab uri={key} name={file} />
            )}
          </div>
        );
      })}
    </Box>
  );
};
