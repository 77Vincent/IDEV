// Modules to control application life and create native browser window
const {
    app,
    BrowserWindow,
    Menu,
    MenuItem,
    ipcMain,
    dialog,
} = require('electron')
const fs = require('fs')
const path = require('path')

require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
})

const isMac = process.platform === 'darwin'

let win

const template = [
    {
        label: app.name,
        submenu: [
            {
                role: 'help',
                accelerator:
                    isMac ? 'Alt+Cmd+I' : 'Alt+Shift+I',
                click: () => {
                },
            },
            {
                role: isMac ? 'close' : 'quit',
            },
            {}
        ],
    },
    {
        label: 'File',
        submenu: [
            {
                label: 'Open File',
                accelerator: isMac ? 'Cmd+O' : 'Win+O',
                click: async () => {
                    const { filePaths } = await dialog.showOpenDialog({
                        properties: ['openFile'],
                    })
                    const file = filePaths[0]
                    const contents = fs.readFileSync(file, 'utf8')
                    win.webContents.send('fromMain', {
                        type: 'file',
                        path: file,
                        contents,
                    })
                },
            },
        ],
    },
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            contextIsolation: true,
            enableRemoteModule: false, // turn off remote
            preload: path.join(__dirname, './src/preload.js'),
        },
    })

    // and load the index.html of the app.
    win.loadFile('index.html')

    // Open the DevTools.
    win.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    createWindow()

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (!isMac) app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
