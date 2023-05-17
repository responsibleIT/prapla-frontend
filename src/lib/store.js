import {writable} from "svelte/store";

export const words = writable([]);
export const user = writable(null);

export const quiz = writable([]);