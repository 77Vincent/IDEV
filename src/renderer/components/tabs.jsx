import { Box, styled, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

const Wrapper = styled('div')(({ theme }) => {
  return {
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: theme.palette.grey[800],
    width: '100%',
    backgroundColor: 'rgba(50,50,50,0.3)',
    backdropFilter: 'blur(15px)',
    zIndex: 1,
    position: 'absolute',
    height: 24,
  };
});

const ActiveTab = styled('div')(({ theme }) => {
  return {
    backgroundColor: theme.palette.grey[600],
    color: theme.palette.common.white,
  };
});

const StyledTab = styled('div')(({ theme }) => {
  return {
    '&:hover': {
      backgroundColor: theme.palette.grey[800],
    },
    cursor: 'pointer',
  };
});

export default () => {
  const [openFileSession, setOpenFileSession] = useState('');
  const [fileSessions, setFileSessions] = useState({});

  useEffect(() => {
    window.electron.ipcRenderer.on(
      'RENDERER_UPDATE_FILE_SESSIONS',
      ({ name, uri }) => {
        setFileSessions((prevState) => {
          return Object.assign(prevState, { [uri]: name });
        });
      }
    );

    window.electron.ipcRenderer.on(
      'RENDERER_CLOSE_OPEN_FILE_SESSION',
      ({ uri }) => {
        delete fileSessions[uri];
        setFileSessions({ ...fileSessions });
      }
    );
    window.electron.ipcRenderer.on(
      'RENDERER_UPDATE_OPEN_FILE_SESSION',
      ({ uri }) => {
        setOpenFileSession(String(uri));
      }
    );
  }, []);

  const Tab = ({ name, uri }) => {
    return (
      <StyledTab>
        <Box
          height={24}
          minWidth={75}
          display="flex"
          justifyContent="center"
          alignItems="center"
          paddingLeft={1}
          paddingRight={1}
          onClick={() => {
            setOpenFileSession(uri);
            window.electron.ipcRenderer.send('MAIN_LOAD_FILE', { uri });
          }}
        >
          <Typography variant="body2">{name}</Typography>
        </Box>
      </StyledTab>
    );
  };

  return (
    <Wrapper>
      <Box display="flex">
        {Object.keys(fileSessions).map((key) => {
          const file = fileSessions[key];
          return (
            <Box key={key}>
              {openFileSession === key ? (
                <ActiveTab>
                  <Tab uri={key} name={file} />
                </ActiveTab>
              ) : (
                <Tab uri={key} name={file} />
              )}
            </Box>
          );
        })}
      </Box>
    </Wrapper>
  );
};
