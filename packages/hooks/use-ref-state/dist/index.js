"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  useRefState: () => useRefState
});
module.exports = __toCommonJS(src_exports);
var import_react = require("react");
function useRefState(initialState) {
  const [state, setState] = (0, import_react.useState)(() => {
    return typeof initialState === "function" ? initialState() : initialState;
  });
  const ref = (0, import_react.useRef)(initialState);
  (0, import_react.useEffect)(() => {
    ref.current = state;
  }, [state]);
  const setValue = (val) => {
    const result = typeof val === "function" ? val(ref.current) : val;
    ref.current = result;
    setState(result);
  };
  return [state, setValue, ref];
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useRefState
});
