import * as React from 'react';
import { Box, styled } from '@mui/material';
import CodeMirror from 'codemirror';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/matchtags';
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/selection/active-line';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/keymap/vim';
import '../theme/codemirror.css';
import '../theme/editor-dark.css';
import FileInfo from './fileInfo';
import Tabs from './tabs';
import StoreContext from '../context';
import { EDITOR_FOCUS, EDITOR_REFRESH } from '../actions';

const TextareaWrapper = styled('div')`
  position: absolute;
  top: 24px;
  bottom: 24px;
  width: 100%;
`;

export default class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.textareaNode = React.createRef();
  }

  componentDidMount() {
    const editor = CodeMirror.fromTextArea(this.textareaNode, {
      mode: 'jsx',
      lineNumbers: true,
      theme: 'darcula',
      autofocus: true,
      autoCloseBrackets: true,
      matchtags: true,
      matchBrackets: true,
      keyMap: 'vim',
      cursorScrollMargin: 50,
      styleActiveLine: true,
      value: '',
      extraKeys: {
        'Cmd-/': (cm) => {
          cm.execCommand('toggleComment');
        },
      },
    });
    editor.setSize('100%', '100%');
    editor.on('cursorActivity', (cm) => {
      const { setCursorLine, setCursorCh } = this.context;
      const { line, ch } = cm.getCursor();
      setCursorLine(line);
      setCursorCh(ch);
    });

    window.electron.ipcRenderer.on(EDITOR_REFRESH, () => {
      const { openFileContent, cursorLine, cursorCh } = this.context;
      editor.focus();
      editor.setValue(openFileContent || '');
      editor.setCursor({ line: cursorLine || 0, ch: cursorCh || 0 });
    });

    window.electron.ipcRenderer.on(EDITOR_FOCUS, () => {
      editor.focus();
    });
  }

  render() {
    const { openFileUri, cursorLine, cursorCh } = this.context;

    return (
      <StoreContext.Consumer>
        {({ fileExplorerWidth }) => (
          <Box
            style={{ width: `calc(100% - ${fileExplorerWidth}px)` }}
            position="relative"
            height="100%"
          >
            <Tabs />
            <TextareaWrapper>
              <textarea
                ref={(ref) => {
                  this.textareaNode = ref;
                }}
              />
            </TextareaWrapper>
            <FileInfo
              uri={openFileUri}
              pos={{ line: cursorLine, ch: cursorCh }}
            />
          </Box>
        )}
      </StoreContext.Consumer>
    );
  }
}

Editor.contextType = StoreContext;
