"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/mocks/index.ts
var mocks_exports = {};
__export(mocks_exports, {
  mocks: () => mocks
});
module.exports = __toCommonJS(mocks_exports);

// src/mocks/image.ts
var originalImage = window.Image;
function mockImage() {
  let status;
  window.Image = class Image {
    constructor() {
      __publicField(this, "onload", () => {
        console.log("called");
      });
      __publicField(this, "onerror", () => {
      });
      __publicField(this, "src", "");
      __publicField(this, "alt", "");
      setTimeout(() => {
        if (status === "error") {
          this.onerror();
        } else {
          this.onload();
        }
      }, mockImage.DELAY);
      return this;
    }
    hasAttribute(name) {
      return name in this;
    }
    getAttribute(name) {
      return name in this ? this[name] : null;
    }
  };
  return {
    simulate(value) {
      status = value;
    },
    restore() {
      window.Image = originalImage;
    }
  };
}
mockImage.restore = () => {
  window.Image = originalImage;
};
mockImage.DELAY = 100;

// src/mocks/index.ts
var mocks = {
  image: mockImage
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  mocks
});
