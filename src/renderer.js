// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

window.addEventListener('DOMContentLoaded', () => {
    const ed = document.getElementById('editor')
    const ep = document.getElementById('file-explorer')

    const editor = CodeMirror.fromTextArea(ed, {
        mode: 'javascript',
        lineNumbers: true,
        theme: "darcula",
        autofocus: true,
        autoCloseBrackets: true,
        matchtags: true,
        matchBrackets: true,
        indentUnit: 4,
        keyMap: "vim",
        extraKeys: {
            "Cmd-/": (cm) => {
                cm.execCommand('toggleComment')
            }
        }
    })

    window.api.get('fromMain', (data) => {
    })
})
