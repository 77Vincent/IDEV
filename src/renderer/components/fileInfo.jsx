import { Box, styled, Tooltip, Typography } from '@mui/material';
import { useContext } from 'react';

import { VerticalDivider, Wrapper } from './common';
import { TAB_HEIGHT } from '../../common/consts';
import StoreContext from '../context';
import { textCutter } from '../../common/util';

const StyledWrapper = styled(Wrapper)`
  border-top-width: 1px;
  border-top-style: solid;
  border-top-color: ${({ theme }) => theme.palette.grey[800]};
  color: ${({ theme }) => theme.palette.grey[400]};
  bottom: 0;
`;

const FileInfo = ({ mode }) => {
  const { openFileUri, cursorLine, cursorCh } = useContext(StoreContext);

  return (
    <StyledWrapper>
      <Box
        paddingRight={1}
        paddingLeft={1}
        height={TAB_HEIGHT}
        justifyContent="space-between"
        display="flex"
      >
        <Box alignItems="center" height="100%" display="flex">
          <Typography variant="body2">{mode}</Typography>
          <VerticalDivider />
          <Tooltip title="cursor position">
            <Typography variant="body2">
              {cursorLine + 1}:{cursorCh + 1}
            </Typography>
          </Tooltip>
          <VerticalDivider />
        </Box>

        <Box display="flex" alignItems="center">
          <Tooltip title={openFileUri}>
            <Typography variant="body2">
              {textCutter(openFileUri, 30)}
            </Typography>
          </Tooltip>
        </Box>
      </Box>
    </StyledWrapper>
  );
};

export default FileInfo;
