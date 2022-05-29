const fs = require('fs')

function isDir(path) {
    return fs.lstatSync(path).isDirectory()
}

module.exports = {
    isDir,
}
