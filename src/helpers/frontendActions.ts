import type { Action } from "./actionsList";

const handleFrontendAction = (action: Action, event?: KeyboardEvent) => {
  switch (action.action) {
    case "bookmark":
      if (event?.ctrlKey || event?.metaKey) {
        window.open(action.url);
      } else {
        window.open(action.url, "_self");
      }
      break;
    case "scroll-bottom":
      window.scrollTo(0, document.body.scrollHeight);
      break;
    case "scroll-top":
      window.scrollTo(0, 0);
      break;
    case "close-tab":
      window.close();
      break;
    case "navigation":
      if (event?.ctrlKey) {
        window.open(action.url);
      } else {
        window.open(action.url, "_self");
      }
      break;
    case "fullscreen":
      const elem = document.documentElement;
      elem.requestFullscreen();
      break;
    case "new-tab":
      window.open("");
      break;
    case "email":
      window.open("mailto:");
      break;
    case "url":
      if (event?.ctrlKey || event?.metaKey) {
        window.open(action.url);
      } else {
        window.open(action.url, "_self");
      }
      break;
  }
};

export default handleFrontendAction;
