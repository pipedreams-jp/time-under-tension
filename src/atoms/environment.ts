import { atom } from "recoil";
import { Environment } from "../types";

const LocalStorageKey = "recoil_environmentState";
const LocalStorageValue = window.localStorage.getItem(LocalStorageKey);

export const environmentState = atom<Environment>({
  key: "environmentState",
  default: LocalStorageValue ? (LocalStorageValue as Environment) : "gym",
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
