const listeners = [
  {
    type: "focus",
    listener: (e) => focusSomni(),
    useCapture: true,
  },
  {
    type: "focusin",
    listener: (e) => focusSomni(),
    useCapture: true,
  },
  {
    type: "focusout",
    listener: (e) => blurSomni(),
    useCapture: true,
  },
  {
    type: "blur",
    listener: (e) => blurSomni(),
    useCapture: true,
  },
];

const focusSomni = () => {
  const somni = document.getElementById("somni-input");

  if (somni) {
    somni.focus();
  }
};

const blurSomni = () => {
  const somni = document.getElementById("somni-input");

  if (somni) {
    somni.blur();
  }
};

// This function removes all document listeners, removing the chance of conflicts
const addOverrideListeners = () => {
  for (const listener of listeners) {
    document.addEventListener(
      listener.type,
      listener.listener,
      listener.useCapture
    );
  }
};

const removeOverrideListeners = () => {
  for (const listener of listeners) {
    document.removeEventListener(
      listener.type,
      listener.listener,
      listener.useCapture
    );
  }
};

export { addOverrideListeners, removeOverrideListeners };
