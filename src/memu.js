function menuTemplate(win) {
return const template = [
  {
    label: 'IDEV',
    submenu: [{
      role: 'help',
      accelerator: process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Alt+Shift+I',
      click: () => { console.log('Electron rocks!') }
    }]
  },
  {
    label: "File",
    submenu: [
      {
        label: "Open File",
        click: async () => {
          const { filePaths } = await dialog.showOpenDialog({
            properties: ["openFile"]
          })
          const file = filePaths[0]
          const contents = fs.readFileSync(file, 'utf8')
          console.log(contents)
        }
      }
    ]
  }
]
}


