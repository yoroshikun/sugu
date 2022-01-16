import type { Action } from "./types";

// Actions
const navigate = (url: string, event?: KeyboardEvent) => {
  if (event?.ctrlKey || event?.metaKey) {
    window.open(url, "_blank");
  } else {
    window.open(url, "_self");
  }
};

const scrollToBottom = () => window.scrollTo(0, document.body.scrollHeight);

const scrollToTop = () => window.scrollTo(0, 0);

const closeTab = () => window.close();

const openFullscreen = () => document.documentElement.requestFullscreen();

const newTab = () => window.open("");

const newEmail = () => window.open("mailto:");

const handleAction = (action: Action, event?: KeyboardEvent) => {
  switch (action.action) {
    case "bookmark":
      return navigate(action.url, event);
    case "scroll-bottom":
      return scrollToBottom();
    case "scroll-top":
      return scrollToTop();
    case "close-tab":
      return closeTab();
    case "navigation":
      return navigate(action.url, event);
    case "fullscreen":
      return openFullscreen();
    case "new-tab":
      return newTab();
    case "email":
      return newEmail();
    case "url":
      return navigate;
  }
};

export default handleAction;
