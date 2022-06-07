import { Box, styled, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

const ActiveTab = styled('div')(({ theme }) => {
  return {
    backgroundColor: theme.palette.common.black,
  };
});

const StyledTab = styled('div')(({ theme }) => {
  return {
    '&:hover': {
      backgroundColor: theme.palette.grey.A700,
    },
    cursor: 'pointer',
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
      <StyledTab>
        <Box
          height={24}
          display="flex"
          onClick={() => {
            setOpenFileSession(uri);
            window.electron.ipcRenderer.send('MAIN_LOAD_FILE', [uri]);
          }}
          alignItems="center"
          paddingLeft={1}
          paddingRight={1}
        >
          <Typography variant="body2">{name}</Typography>
        </Box>
      </StyledTab>
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
