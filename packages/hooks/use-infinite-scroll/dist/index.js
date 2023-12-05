"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  useInfiniteScroll: () => useInfiniteScroll
});
module.exports = __toCommonJS(src_exports);
var import_lodash = __toESM(require("lodash.debounce"));
var import_react = require("react");
function useInfiniteScroll(props = {}) {
  const { hasMore, distance = 250, isEnabled = true, shouldUseLoader = true, onLoadMore } = props;
  const scrollContainerRef = (0, import_react.useRef)(null);
  const loaderRef = (0, import_react.useRef)(null);
  const previousY = (0, import_react.useRef)();
  const previousRatio = (0, import_react.useRef)(0);
  (0, import_react.useLayoutEffect)(() => {
    const scrollContainerNode = scrollContainerRef.current;
    if (!isEnabled || !scrollContainerNode || !hasMore)
      return;
    if (shouldUseLoader) {
      const loaderNode = loaderRef.current;
      if (!loaderNode)
        return;
      const options = {
        root: scrollContainerNode,
        rootMargin: `0px 0px ${distance}px 0px`
      };
      const listener = (entries) => {
        entries.forEach(({ isIntersecting, intersectionRatio, boundingClientRect = {} }) => {
          const y = boundingClientRect.y || 0;
          if (isIntersecting && intersectionRatio >= previousRatio.current && (!previousY.current || y < previousY.current)) {
            onLoadMore == null ? void 0 : onLoadMore();
          }
          previousY.current = y;
          previousRatio.current = intersectionRatio;
        });
      };
      const observer = new IntersectionObserver(listener, options);
      observer.observe(loaderNode);
      return () => observer.disconnect();
    } else {
      const debouncedOnLoadMore = onLoadMore ? (0, import_lodash.default)(onLoadMore, 200) : void 0;
      const checkIfNearBottom = () => {
        if (scrollContainerNode.scrollHeight - scrollContainerNode.scrollTop <= scrollContainerNode.clientHeight + distance) {
          debouncedOnLoadMore == null ? void 0 : debouncedOnLoadMore();
        }
      };
      scrollContainerNode.addEventListener("scroll", checkIfNearBottom);
      return () => {
        scrollContainerNode.removeEventListener("scroll", checkIfNearBottom);
      };
    }
  }, [hasMore, distance, isEnabled, onLoadMore, shouldUseLoader]);
  return [loaderRef, scrollContainerRef];
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useInfiniteScroll
});
