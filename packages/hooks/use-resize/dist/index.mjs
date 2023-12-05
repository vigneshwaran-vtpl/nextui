// src/index.ts
import { useEffect } from "react";
function useResize(callback, immediatelyInvoke = true) {
  useEffect(() => {
    const fn = () => callback();
    if (immediatelyInvoke) {
      fn();
    }
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
}
export {
  useResize
};
