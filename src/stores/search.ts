import { writable } from "svelte/store";

export interface SearchData {
  previous: string;
  current: string;
  command: string | null;
}

const validCommands = ["tabs", "bookmarks", "history", "actions", "remove"];

const createSearch = () => {
  const { subscribe, set, update } = writable<SearchData>({
    previous: "",
    current: "",
    command: null,
  });

  return {
    subscribe,
    update: (value: string) => {
      let enteredCommandMode = false;
      update((prev) => {
        if (prev.current === value) {
          return prev;
        }

        if (value.startsWith("/") && value.endsWith(" ")) {
          const currentCommand = value.trim().toLowerCase().replace("/", "");
          if (validCommands.includes(currentCommand)) {
            enteredCommandMode = true;
            return { previous: "", current: "", command: currentCommand };
          }
        }

        return {
          previous: prev.current,
          current: value,
          command: prev.command,
        };
      });
      return enteredCommandMode;
    },
    reset: () => {
      set({ previous: "", current: "", command: null });
    },
  };
};

export const search = createSearch();
