import { createTheme } from '@mui/material/styles';
import { green } from '@mui/material/colors';

export default createTheme({
  palette: {
    primary: {
      main: '#74b46a',
      dark: '#396432',
    },
    secondary: {
      main: green[500],
    },
  },
  typography: {
    body1: {
      fontSize: 14,
    },
    body2: {
      fontSize: 12,
    },
  },
});
