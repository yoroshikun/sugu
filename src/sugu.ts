import Sugu from "./components/Sugu.svelte";

let suguApp;

const initSugu = () => {
  const body = document.body;
  const target = document.createElement("div");
  target.id = "sugu-search";

  body.appendChild(target);

  return new Sugu({
    target,
  });
};

const addSuguListener = (message) => {
  if (message.request === "open-sugu") {
    if (!suguApp) {
      suguApp = initSugu();
    }
  }
};

chrome.runtime.onMessage.addListener(addSuguListener);
