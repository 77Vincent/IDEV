import * as React from 'react';
import { Box } from '@mui/material';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/matchtags';
import 'codemirror/addon/comment/comment';
import 'codemirror/mode/javascript/javascript';
// import 'codemirror/mode/overlay';
import 'codemirror/keymap/vim';

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
      mode: 'javascript',
      lineNumbers: true,
      theme: 'darcula',
      autofocus: true,
      autoCloseBrackets: true,
      matchtags: true,
      matchBrackets: true,
      indentUnit: 4,
      keyMap: 'vim',
      cursorScrollMargin: 24,
      extraKeys: {
        'Cmd-/': (cm) => {
          cm.execCommand('toggleComment');
        },
      },
    });

    editor.setValue(this.state.content);
    editor.setSize('100%', '100%');

    window.electron.ipcRenderer.on('EDITOR_LOAD_FILE', (args) => {
      const { content } = args;
      this.setState({ content });
      editor.setValue(content);
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
