/* eslint import/prefer-default-export: off, import/no-mutable-exports: off */
import fs from 'fs';
import { URL } from 'url';
import path from 'path';

export let resolveHtmlPath;

if (process.env.NODE_ENV === 'development') {
  const port = process.env.PORT || 1212;
  resolveHtmlPath = (htmlFileName) => {
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  };
} else {
  resolveHtmlPath = (htmlFileName) => {
    return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
  };
}

export function isDir(file) {
  return fs.lstatSync(file).isDirectory();
}

export function isDarwin() {
  return process.platform === 'darwin';
}

export function debounce(func, timeout = 20) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}
