import { useCallback, useEffect, useRef, useState } from "react";

import Canvas from "./canvas";
import useMouse from "./useMouse";
import useParentSize from "./useParentSize";
import useRandomPos from "./useRandomPos";
import { useCountableEffect } from "../../react-utils/src/utils";


const INTERVAL_TIME = 300; // ms

interface IBullet {
  x: number;
  y: number;
}

/* 
  size of screen: width, height
*/
const useBullets = (width: number, height: number) => {
  const [bullets, setBullets] = useState<IBullet[]>([]);
  const posRef = useRef<any>(null);

  useEffect(() => {
    posRef.current = setInterval(() => {
      setBullets(bs => {
        return bs.map(b => {
          // to-do: x == -1 and y == -1 => remove bullet
          if (false) {
            return { x: -1, y: -1 };
          } else {
            return {
              ...b
            };
          }
        }).filter(b => b.x !== -1 && b.y !== -1);
      });
    }, INTERVAL_TIME);

    return () => {
      clearInterval(posRef.current);
    }
  }, [bullets]);

  // position of player and direction of cannon when firing
  const shoot = useCallback((x: number, y: number, dx: number, dy: number) => {
    setBullets(b => {
      return [
        ...b,
        { x, y }
      ];
    })
  }, []);

  return [
    bullets,
    shoot
  ];
}


const Shooting = () => {
  const canvasRef = useRef<any>();
  const canvasRender = useRef<any>();
  const [[width, height], divRef] = useParentSize();
  const { pos: [x, y], mouseProps, setMouseCallback } = useMouse();
  const { pos: [tx, ty], update } = useRandomPos({ interval: [.2, .8] });
  console.log(68, [tx, ty]);
  // const [bullets, shoot] = useBullets(800, 600);

  useEffect(() => {
    setMouseCallback("onClick", (x1: number, y1: number) => {
      if (canvasRender.current.isInsideTarget([x1, y1], [tx, ty])) {
        update();
      }
    });
  }, [tx, ty]);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      canvasRender.current = new Canvas(ctx, width, height);
    }
  }, [width, height]);

  useEffect(() => {
    if (canvasRef.current) {
      canvasRender.current.render([x, y], [tx, ty]);
    }
  }, [x, y, tx, ty]);

  return (
    <div className="h-100 d-flex" ref={divRef}>
      {width !== 0 && height !== 0 && <canvas width={width} height={height} ref={canvasRef} {...mouseProps} />}
    </div>
  );
};

export default Shooting;