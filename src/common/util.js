export function debounce(func, timeout = 20) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

export function textCutter(text = '', len = 10) {
  const l = text.length;
  return `...${text.slice(l - len, l)}`;
}
