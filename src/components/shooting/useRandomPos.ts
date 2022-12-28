import { useState } from "react";

import { initArray } from "../../utils";

interface useRandomPosOutput {
  pos: number[];
  update: () => void;
}

const useRandomPos = (size: number = 2): useRandomPosOutput => {
  const [x, setX] = useState<number[]>(initArray(size).map(_ => Math.random()));

  return {
    pos: x,
    update: () => setX(x.map(_ => Math.random()))
  };
}

export default useRandomPos