import * as React from 'react';
import CodeMirror from 'codemirror';
import { Box } from '@mui/material';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/matchtags';
import 'codemirror/addon/comment/comment';
import 'codemirror/theme/darcula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/keymap/vim';

export default class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.textareaNode = React.createRef();
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
      extraKeys: {
        'Cmd-/': (cm) => {
          cm.execCommand('toggleComment');
        },
      },
    });
    editor.setSize('100%', '100%');
  }

  render() {
    return (
      <textarea
        ref={(ref) => {
          this.textareaNode = ref;
        }}
      />
    );
  }
}
