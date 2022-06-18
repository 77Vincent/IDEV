import * as React from 'react';
import { Box, styled } from '@mui/material';
import CodeMirror from 'codemirror';

import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/matchtags';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/javascript-hint';
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/search/search';
import 'codemirror/addon/search/match-highlighter';
import 'codemirror/addon/search/searchcursor';
import 'codemirror/addon/search/jump-to-line';
import 'codemirror/addon/dialog/dialog';
import 'codemirror/addon/selection/active-line';

import 'codemirror/mode/jsx/jsx';
import 'codemirror/keymap/vim';

import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/dialog/dialog.css';

import '../theme/codemirror.css';
import '../theme/editor-dark.css';
import FileInfo from './fileInfo';
import Tabs from './tabs';
import StoreContext from '../context';
import {
  EDITOR_FOCUS,
  EDITOR_REFRESH,
  VIM_MODE_MAP,
} from '../../common/consts';

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
    this.state = {
      mode: VIM_MODE_MAP.normal,
    };
  }

  componentDidMount() {
    const editor = CodeMirror.fromTextArea(this.textareaNode, {
      mode: 'text/jsx',
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
      highlightSelectionMatches: true,
      extraKeys: {
        'Cmd-/': (cm) => {
          cm.execCommand('toggleComment');
        },
        'Cmd-F': (cm) => {
          cm.execCommand('find');
        },
        '/': (cm) => {
          cm.execCommand('find');
        },
      },
    });
    editor.setSize('100%', '100%');
    editor.on('vim-mode-change', ({ mode }) => {
      this.setState({ mode });
    });
    editor.on('cursorActivity', (cm) => {
      const { setCursorLine, setCursorCh } = this.context;
      const { line, ch } = cm.getCursor();
      const { mode } = this.state;
      setCursorLine(line);
      setCursorCh(ch);

      if (mode === VIM_MODE_MAP.insert) {
        editor.showHint({
          // hin() {
          //   const token = cm.getTokenAt({ line, ch });
          //   console.log(22222222, token)
          //   const start = token.start;
          //   const end = ch;
          //   const currentWord = token.string;
          //   return {
          //     from: CodeMirror.Pos(line, start),
          //     to: CodeMirror.Pos(line, end),
          //   };
          // },
          completeSingle: false,
        });
      }
    });

    window.electron.ipcRenderer.on(EDITOR_REFRESH, () => {
      const {
        openFileUri: ofu,
        fileSessions: fss,
        setCursorLine,
        setCursorCh,
      } = this.context;
      let found = {};

      for (let i = 0; i < fss.length; i += 1) {
        const v = fss[i];
        // found the file
        if (v.uri === ofu) {
          editor.focus();
          found = v;
          break;
        }
      }

      const { cursorLine, cursorCh, content } = found;
      setCursorLine(cursorLine);
      setCursorCh(cursorCh);
      editor.setValue(content || '');
      editor.setCursor({ line: cursorLine || 0, ch: cursorCh || 0 });
    });

    window.electron.ipcRenderer.on(EDITOR_FOCUS, () => {
      editor.focus();
    });
  }

  render() {
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
            <FileInfo />
          </Box>
        )}
      </StoreContext.Consumer>
    );
  }
}

Editor.contextType = StoreContext;
