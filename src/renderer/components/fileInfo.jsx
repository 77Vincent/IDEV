import { Box, styled, Typography } from '@mui/material';
import PT from 'prop-types';
import { Wrapper } from './common';
import { TAB_HEIGHT } from '../../common/consts';

const StyledWrapper = styled(Wrapper)`
  border-top-width: 1px;
  border-top-style: solid;
  border-top-color: ${({ theme }) => theme.palette.grey[800]};
  bottom: 0;
`;

const FileInfo = (props) => {
  const {
    uri,
    pos: { line, ch },
  } = props;

  return (
    <StyledWrapper>
      <Box height={TAB_HEIGHT} display="flex">
        <Typography variant="body2">
          {line + 1}:{ch + 1}
        </Typography>

        <Typography variant="body2">{uri}</Typography>
      </Box>
    </StyledWrapper>
  );
};

FileInfo.propTypes = {
  uri: PT.string,
  pos: PT.exact({
    line: PT.number,
    ch: PT.number,
  }),
};

FileInfo.defaultProps = {
  uri: '',
  pos: {
    line: 0,
    ch: 0,
  },
};

export default FileInfo;
