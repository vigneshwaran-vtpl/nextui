// src/index.ts
import { useState, useEffect } from "react";
import { getRealShape } from "@nextui-org/react-utils";
function useRealShape(ref) {
  const [shape, setState] = useState({
    width: 0,
    height: 0
  });
  const updateShape = () => {
    if (!(ref == null ? void 0 : ref.current))
      return;
    const { width, height } = getRealShape(ref.current);
    setState({ width, height });
  };
  useEffect(() => updateShape(), [ref.current]);
  return [shape, updateShape];
}
export {
  useRealShape
};
