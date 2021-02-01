import { atom } from "recoil";

const LocalStorageKey = "recoil_bodyweightState";
const LocalStorageValue = window.localStorage.getItem(LocalStorageKey);

export const bodyweightState = atom({
  key: "bodyweightState",
  default: LocalStorageValue ? parseFloat(LocalStorageValue) : undefined,
  effects_UNSTABLE: [
    ({ onSet }) => {
      onSet((newValue) => {
        if (newValue) {
          window.localStorage.setItem(LocalStorageKey, newValue.toString());
        }
      });
    },
  ],
});
