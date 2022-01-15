import type { Action } from "../helpers/actionsList";
import { writable } from "svelte/store";
import { reset } from "../helpers/actionReset";

const createActions = () => {
  const { subscribe, set, update } = writable<Action[]>([]);

  return {
    subscribe,
    set: (actions: Action[]) => {
      set(actions);
    },
    reset: async () => {
      set(await reset()); // A frontend reset
    },
  };
};

export const actions = createActions();
