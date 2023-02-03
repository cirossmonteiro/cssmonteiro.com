import { useState } from "react";

import { initArray, randomNumber } from "../../react-utils/src/utils";

interface useRandomPosOutput {
  pos: number[];
  update: () => void;
}

const map = (interval: [number, number]) => () => randomNumber(interval[0], interval[1]);

const useRandomPos = ({ size = 2 as number, interval = [0, 1] as [number, number]}): useRandomPosOutput => {
  const [x, setX] = useState<number[]>(initArray(size).map(map(interval)));

  return {
    pos: x,
    update: () => setX(x.map(map(interval)))
  };
}

export default useRandomPos