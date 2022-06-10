import { Box, styled, Typography } from '@mui/material';
import PT from 'prop-types';

export const Wrapper = styled('div')(({ theme }) => {
  return {
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: theme.palette.grey[800],
    width: '100%',
    backgroundColor: 'rgba(50,50,50,0.3)',
    backdropFilter: 'blur(15px)',
    zIndex: 1,
    position: 'absolute',
    height: 24,
    bottom: 0,
  };
});

const FileInfo = (props) => {
  const {
    pos: { line, ch },
  } = props;

  return (
    <Wrapper>
      <Box display="flex">
        <Typography variant="body2">
          {line}:{ch}
        </Typography>
      </Box>
    </Wrapper>
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
