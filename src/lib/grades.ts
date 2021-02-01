import { Grade, TickType } from "../types";

export function toLabel(type: TickType, value: Grade) {
  switch (type) {
    case "boulder":
      return findByValue(BoulderGrades, value)!;
    case "sport":
    case "trad":
      return findByValue(RouteGrades, value)!;
  }
}

export function toValue(type: TickType, value: string) {
  switch (type) {
    case "boulder":
      return BoulderGrades[value];
    case "sport":
    case "trad":
      return RouteGrades[value];
  }
}

export const BoulderGrades = Object.fromEntries<number>(
  [
    "V0",
    "V1",
    "V2",
    "V3",
    "V4",
    "V5",
    "V6",
    "V7",
    "V8",
    "V9",
    "V10",
    "V11",
    "V12",
    "V13",
    "V14",
    "V15",
    "V16",
    "V17",
  ].map(toLabelIndexTuple)
);

export const RouteGrades = Object.fromEntries(
  [
    "5.4",
    "5.5",
    "5.6",
    "5.7",
    "5.8",
    "5.9",
    "5.10a",
    "5.10b",
    "5.10c",
    "5.10d",
    "5.11a",
    "5.11b",
    "5.11c",
    "5.11d",
    "5.12a",
    "5.12b",
    "5.12c",
    "5.12d",
    "5.13a",
    "5.13b",
    "5.13c",
    "5.13d",
    "5.14a",
    "5.14b",
    "5.14c",
    "5.14d",
    "5.15a",
    "5.15b",
    "5.15c",
    "5.15d",
  ].map(toLabelIndexTuple)
);

function toLabelIndexTuple(label: string, index: number) {
  return [label, index] as const;
}

function findByValue<O extends Record<string, V>, V>(object: O, value: V) {
  return Object.keys(object).find((key) => object[key] === value);
}
