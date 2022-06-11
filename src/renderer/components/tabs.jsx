import { Box, styled, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import PT from 'prop-types';

import { Wrapper } from './common';
import StoreContext from '../context';

const StyledWrapper = styled(Wrapper)`
  top: 0;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: ${({ theme }) => theme.palette.grey[800]};
`;

export default () => {
  const { fileSessions, setFileSessions } = useContext(StoreContext);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      'RENDERER_SET_FILE_SESSIONS',
      ({ fileSessions: fileSessionsInput }) => {
        setFileSessions([...fileSessionsInput]);
      }
    );
  }, []);

  const Tab = (props) => {
    const { name, uri } = props;
    return (
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
        {...props}
      >
        <Typography fontWeight="inherit" variant="body2">
          {name}
        </Typography>
      </Box>
    );
  };

  const StyledTab = styled(Tab)`
    &:hover: {
      background-color: ${({ theme }) => theme.palette.grey[800]};
    }
    cursor: pointer;
  `;

  const ActiveTab = styled(StyledTab)`
    background-color: ${({ theme }) => theme.palette.grey[600]};
    color: white;
    font-weight: 400;
  `;

  Tab.propTypes = {
    name: PT.string.isRequired,
    uri: PT.string.isRequired,
  };
  return (
    <StyledWrapper>
      <Box display="flex">
        {fileSessions.map(({ uri, name, open }) => {
          return (
            <Box key={uri}>
              {open ? (
                <ActiveTab uri={uri} name={name} />
              ) : (
                <StyledTab uri={uri} name={name} />
              )}
            </Box>
          );
        })}
      </Box>
    </StyledWrapper>
  );
};
