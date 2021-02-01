import { atom } from "recoil";
import { TickType } from "../types";

const LocalStorageKey = "recoil_ticktypeState";
const LocalStorageValue = window.localStorage.getItem(LocalStorageKey);

export const ticktypeState = atom<TickType>({
  key: "ticktypeState",
  default: LocalStorageValue ? (LocalStorageValue as TickType) : "boulder",
  effects_UNSTABLE: [
    ({ onSet }) => {
      onSet((newValue) => {
        if (newValue) {
          window.localStorage.setItem(LocalStorageKey, newValue as string);
        }
      });
    },
  ],
});
