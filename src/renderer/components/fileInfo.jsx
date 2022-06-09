import { Box, styled, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

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

export default () => {
  return (
    <Wrapper>
      <Box display="flex">jjjjjjj</Box>
    </Wrapper>
  );
};
