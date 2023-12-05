import {
  __publicField
} from "./chunk-PJDFGZWC.mjs";

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

export {
  mockImage
};
