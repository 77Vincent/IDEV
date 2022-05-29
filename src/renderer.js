// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const explorerItem = (data = 'no data') => {
    const el = $('<div class="file-explorer-item">')
    el.append(data)
    el.click(() => {
        window.api.send('toMain', {
            action: 'openFile',
            payload: {
                path: data
            }
        })
    })
    return el
}

window.addEventListener('DOMContentLoaded', () => {
    const ed = document.getElementById('editor')
    const $fe = $('#file-explorer')

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

    editor.setSize(null, '100%')

    window.api.get('fromMain', (data) => {
        let { action, payload: { contents, type, paths } } = data

        switch (action) {
            case 'openFile': {
                if (type === 'file') {
                    editor.setValue(contents)
                    $fe.empty()
                    $fe.append(explorerItem(paths))
                }
                if (type === 'dir') {
                    $fe.empty()
                    contents.forEach(v => {
                        $fe.append(explorerItem(v))
                    })
                }

                break
            }
        }
    })
})
