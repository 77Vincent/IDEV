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
    fontWeight: 400,
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
  const [fileSessions, setFileSessions] = useState([]);

  useEffect(() => {
    window.electron.ipcRenderer.on('RENDERER_SET_FILE_SESSIONS', (payload) => {
      setFileSessions([...payload]);
    });
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
            window.electron.ipcRenderer.send('MAIN_LOAD_FILE', { uri });
          }}
        >
          <Typography fontWeight="inherit" variant="body2">
            {name}
          </Typography>
        </Box>
      </StyledTab>
    );
  };

  return (
    <Wrapper>
      <Box display="flex">
        {fileSessions.map(({ uri, name, open }) => {
          return (
            <Box key={uri}>
              {open ? (
                <ActiveTab>
                  <Tab uri={uri} name={name} />
                </ActiveTab>
              ) : (
                <Tab uri={uri} name={name} />
              )}
            </Box>
          );
        })}
      </Box>
    </Wrapper>
  );
};
