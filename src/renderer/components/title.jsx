import { styled, Typography } from '@mui/material';
import { TOGGLE_MAXIMIZE, TITLE_SPACE } from '../../common/consts';

const TitleWrapper = styled('div')`
  top: -${TITLE_SPACE}px;
  width: 100%;
  position: absolute;
  text-align: center;
  app-region: drag;
`;

const Title = () => {
  return (
    <TitleWrapper
      onDoubleClick={() =>
        window.electron.ipcRenderer.send(TOGGLE_MAXIMIZE, {})
      }
    >
      <Typography fontWeight={700} variant="body1">
        Vimer
      </Typography>
    </TitleWrapper>
  );
};

export default Title;
