import { styled } from '@mui/material';
import { TAB_HEIGHT } from '../../common/consts';

export const Wrapper = styled('div')(({ theme }) => {
  return {
    width: '100%',
    backgroundColor: 'rgba(50,50,50,0.3)',
    backdropFilter: 'blur(15px)',
    zIndex: 1,
    position: 'absolute',
    height: TAB_HEIGHT,
  };
});
