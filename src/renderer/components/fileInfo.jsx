import { Box, styled, Typography } from '@mui/material';
import PT from 'prop-types';
import { Wrapper } from './common';

const StyledWrapper = styled(Wrapper)`
  border-top-width: 1px;
  border-top-style: solid;
  border-top-color: ${({ theme }) => theme.palette.grey[800]};
  bottom: 0;
`;

const FileInfo = (props) => {
  const {
    pos: { line, ch },
  } = props;

  return (
    <StyledWrapper>
      <Box display="flex">
        <Typography variant="body2">
          {line}:{ch}
        </Typography>
      </Box>
    </StyledWrapper>
  );
};

FileInfo.propTypes = {
  pos: PT.exact({
    line: PT.number,
    ch: PT.number,
  }),
};

FileInfo.defaultProps = {
  pos: {
    line: 0,
    ch: 0,
  },
};

export default FileInfo;
