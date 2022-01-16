import type { Action } from "../actions/types";
import { writable } from "svelte/store";

const createActions = () => {
  const { subscribe, set, update } = writable<Action[]>([]);

  return {
    subscribe,
    set: (actions: Action[]) => {
      set(actions);
    },
  };
};

export const actions = createActions();
