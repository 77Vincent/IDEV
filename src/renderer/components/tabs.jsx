import { Box, styled, Typography } from '@mui/material';
import { useContext } from 'react';
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
  const {
    fileSessions,
    cursorLine,
    cursorCh,
    openFileUri,
    setOpenFileUri,
    setCursorLine,
    setCursorCh,
    setOpenFileContent,
    setFileSessions,
  } = useContext(StoreContext);

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
          // first record the current cursor position to the opening file
          for (let i = 0; i < fileSessions.length; i += 1) {
            const v = fileSessions[i];
            if (v.uri === openFileUri) {
              v.cursorLine = cursorLine;
              v.cursorCh = cursorCh;
              break;
            }
          }

          // then update everything to the new file
          if (openFileUri !== uri) {
            // updating states when opening new file
            const found = fileSessions.find((v) => v.uri === uri);
            setFileSessions(fileSessions);
            setCursorLine(found.cursorLine);
            setCursorCh(found.cursorCh);
            setOpenFileContent(found.content);
            // has to be the last one to trigger the refresh
            setOpenFileUri(uri);
          }
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
        {fileSessions.map(({ uri, name }) => {
          return (
            <Box key={uri}>
              {uri === openFileUri ? (
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
