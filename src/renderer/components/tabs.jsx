import { Box, styled, Typography } from '@mui/material';
import { useContext } from 'react';
import PT from 'prop-types';

import { Wrapper } from './common';
import StoreContext from '../context';
import { TAB_HEIGHT } from '../../common/consts';

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
    setFileSessions,
    setClosingFileMonitor,
  } = useContext(StoreContext);

  const Tab = (props) => {
    const { name, uri } = props;
    return (
      <Box
        height={TAB_HEIGHT}
        minWidth={75}
        display="flex"
        justifyContent="center"
        alignItems="center"
        paddingLeft={1}
        paddingRight={1}
        onDoubleClick={() => {
          setClosingFileMonitor((prev) => !prev);
        }}
        onClick={() => {
          let found = null;
          // first record the current cursor position to the opening file
          // and also store the found file session
          for (let i = 0; i < fileSessions.length; i += 1) {
            const v = fileSessions[i];
            if (v.uri === openFileUri) {
              v.cursorLine = cursorLine;
              v.cursorCh = cursorCh;
            }
            if (v.uri === uri) {
              found = v;
            }
          }

          // only updating when switch to another file
          if (openFileUri !== uri) {
            setFileSessions(fileSessions);
            setCursorLine(found.cursorLine);
            setCursorCh(found.cursorCh);
            setOpenFileUri(uri);
          }
        }}
        {...props}
      >
        <Typography fontWeight="inherit" variant="body1">
          {name}
        </Typography>
      </Box>
    );
  };

  const StyledBox = styled('div')`
    cursor: pointer;
    &:hover: {
      background-color: ${({ theme }) => theme.palette.grey[300]};
    }
  `;

  const ActiveTab = styled(Tab)`
    background-color: ${({ theme }) => theme.palette.grey[600]};
    border-top-right-radius: 3px;
    border-top-left-radius: 3px;
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
            <StyledBox key={uri}>
              {uri === openFileUri ? (
                <ActiveTab uri={uri} name={name} />
              ) : (
                <Tab uri={uri} name={name} />
              )}
            </StyledBox>
          );
        })}
      </Box>
    </StyledWrapper>
  );
};
