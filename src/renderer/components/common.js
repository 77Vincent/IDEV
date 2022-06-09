import { styled } from "@mui/material";

export const Wrapper = styled('div')(({ theme }) => {
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
