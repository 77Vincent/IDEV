import * as React from 'react';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/matchtags';
import 'codemirror/addon/comment/comment';
import 'codemirror/theme/darcula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/keymap/vim';

// import { OPEN_FILES } from '../../main/actions';

export default class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.textareaNode = React.createRef();
    this.state = {
      openFileSession: 0,
      fileSessions: [],
    };
  }

  // componentDidUpdate(prevProps, prevState, snapshot) {
  //   console.log(11111111, prevState);
  // }

  componentDidMount() {
    const { fileSessions, openFileSession } = this.state;
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
    window.electron.ipcRenderer.on('OPEN_FILES', (args) => {
      const { content } = args[0];
      this.setState({
        openFileSession: fileSessions.length,
        fileSessions: fileSessions.concat(args),
      });
      editor.setValue(content);
    });

    editor.setValue(fileSessions[openFileSession] || '');
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
