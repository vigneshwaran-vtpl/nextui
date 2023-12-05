// src/index.ts
import { useEffect, useState } from "react";
var isBrowser = () => {
  return Boolean(typeof window !== "undefined" && window.document && window.document.createElement);
};
var useSSR = () => {
  const [browser, setBrowser] = useState(false);
  useEffect(() => {
    setBrowser(isBrowser());
  }, []);
  return {
    isBrowser: browser,
    isServer: !browser
  };
};
export {
  useSSR
};
