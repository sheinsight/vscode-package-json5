import type { Pointer } from "vs-json5/@types";

export const resolvePoiniterToPath = (pointer: Pointer) => {
  const path = pointer.replace("#/", "");
  return path;
};

export * from "./get-user-settings";
