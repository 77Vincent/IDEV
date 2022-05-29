const path = require('path')

module.exports = {
    entry: './main.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        fallback: {
            util: false,
            path: false,
            os: false,
            stream: false,
            fs: false,
        },
    },
    exports: {
        electron: {
            node: './main.js',
        },
    },
}
