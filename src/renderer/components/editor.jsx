import * as React from 'react';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/matchtags';
import 'codemirror/addon/comment/comment';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/keymap/vim';

import '../theme/editor.css';

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
      extraKeys: {
        'Cmd-/': (cm) => {
          cm.execCommand('toggleComment');
        },
      },
    });

    editor.setValue(this.state.content);
    editor.setSize('100%', '100%');

    window.electron.ipcRenderer.on('EDITOR_LOAD_FILE', (args) => {
      const { content } = args[0];
      this.setState({ content });
      editor.setValue(content);
    });
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
