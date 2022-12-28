import { useCallback, useRef, useState } from "react";

interface useMouseOutput {
  pos: [number, number];
  mouseProps: {
    onClick: (e: any) => void,
    onMouseMove: (e: any) => void,
  },
  setMouseCallback: (eventName: string, callback: (x: number, y: number) => void) => void;
}

const useMouse = (): useMouseOutput => {
  const callbacks = useRef<any>({});
  const [[x, y], setMousePos] = useState<[number, number]>([-1, -1]);

  const onMouseMove = useCallback((e: any) => {
    setMousePos([
      (e.pageX - e.target.offsetLeft)/e.target.clientWidth,
      (e.pageY - e.target.offsetTop)/e.target.clientHeight
    ]);
  }, []);

  const onClick = useCallback((e: any) => {
    callbacks.current?.onClick(x, y);
  }, [x, y]);

  const setMouseCallback = useCallback((eventName: string, callback: (x: number, y: number) => void) => {
    callbacks.current[eventName] = callback;
  }, []);

  return {
    pos: [x, y],
    mouseProps: {
      onClick,
      onMouseMove
    },
    setMouseCallback
  };
}

export default useMouse