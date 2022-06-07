import * as React from 'react';
import { Box } from '@mui/material';
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

export default class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.textareaNode = React.createRef();
    this.state = {
      content: '',
    };
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
      cursorScrollMargin: 24,
      styleActiveLine: true,
      extraKeys: {
        'Cmd-/': (cm) => {
          cm.execCommand('toggleComment');
        },
      },
    });

    editor.setValue(this.state.content);
    editor.setSize('100%', '100%');

    window.electron.ipcRenderer.on('EDITOR_LOAD_FILE', ({ content }) => {
      this.setState({ content });
      editor.setValue(content);
    });

    window.electron.ipcRenderer.on('RENDERER_GET_FILE_CONTENT', () => {
      const content = editor.getValue();
      window.electron.ipcRenderer.send('MAIN_SAVE_FILE', { content });
    });
  }

  render() {
    return (
      <Box overflow="auto" flex={1}>
        <textarea
          ref={(ref) => {
            this.textareaNode = ref;
          }}
        />
      </Box>
    );
  }
}
