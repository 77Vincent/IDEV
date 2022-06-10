import { useCallback, useContext, useState } from 'react';
import { styled } from '@mui/material';

import StoreContext from '../context';

const Wrapper = styled('div')`
  position: relative;
  user-select: none;
`;

const Handler = styled('div')`
  position: absolute;
  right: 0;
  width: 5px;
  cursor: grab;
  height: 100%;
  border-right-style: solid;
  border-right-width: 1px;
  border-right-color: ${({ theme }) => theme.palette.grey[800]};
`;

const Resizable = (props) => {
  const { children } = props;
  const { fileExplorerWidth, setFileExplorerWidth } = useContext(StoreContext);

  function handleMouseDown() {
    document.addEventListener('mouseup', handleMouseUp, true);
    document.addEventListener('mousemove', handleMouseMove, true);
  }

  function handleMouseUp() {
    document.removeEventListener('mouseup', handleMouseUp, true);
    document.removeEventListener('mousemove', handleMouseMove, true);
  }

  const handleMouseMove = useCallback((e) => {
    const newWidth = e.clientX - document.body.offsetLeft;
    if (newWidth > 100 && newWidth < 300) {
      setFileExplorerWidth(newWidth);
    }
  }, []);
  return (
    <Wrapper
      style={{
        width: fileExplorerWidth,
      }}
    >
      <Handler onMouseDown={(e) => handleMouseDown(e)} />
      {children}
    </Wrapper>
  );
};

export default Resizable;
