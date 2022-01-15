// A debounce function that ignores calls after the first one.
function debounce_leading(func, timeout = 300) {
  let timer;

  return (...args) => {
    if (!timer) {
      func.apply(this, args);
    }

    clearTimeout(timer);

    timer = setTimeout(() => {
      timer = undefined;
    }, timeout);
  };
}

export default debounce_leading;
