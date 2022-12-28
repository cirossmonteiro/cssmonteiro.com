import { MutableRefObject, useCallback, useEffect, useRef, useState } from "react";

type useParentSizeOutput = [[number, number], MutableRefObject<any>];

const useParentSize = (): useParentSizeOutput => {
  const parentRef = useRef<any>();
  const [[width, height], setSize] = useState<any>([0, 0]);

  const handleSize = useCallback(() => {
    setSize([
      parentRef.current.clientWidth,
      parentRef.current.clientHeight
    ]);
  }, []);

  useEffect(() => {
    handleSize();
    window.addEventListener("resize", handleSize);
    return () => {
      window.removeEventListener("resize", handleSize);
    }
  }, []);

  return [
    [width, height],
    parentRef
  ];
}

export default useParentSize;