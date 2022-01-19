const listeners = [
  {
    type: "focus",
    listener: (e) => focussugu(),
    useCapture: true,
  },
  {
    type: "focusin",
    listener: (e) => focussugu(),
    useCapture: true,
  },
  {
    type: "focusout",
    listener: (e) => blursugu(),
    useCapture: true,
  },
  {
    type: "blur",
    listener: (e) => blursugu(),
    useCapture: true,
  },
];

const focussugu = () => {
  const sugu = document.getElementById("sugu-input");

  if (sugu) {
    sugu.focus();
  }
};

const blursugu = () => {
  const sugu = document.getElementById("sugu-input");

  if (sugu) {
    sugu.blur();
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
