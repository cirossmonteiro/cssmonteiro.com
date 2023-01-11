import { useEffect, useRef, useState } from "react";

export const initArray = (n: number) => Array.apply(null, Array(n)).map((_, index) => index);

export const addLeadingZeros = (s: string, totalLength: number) => s.padStart(totalLength, '0');

export const intToHex = (n: number) => `#${addLeadingZeros(n.toString(16), 6)}`;

export const equalArrays = <T> (x: T[], y: T[]) => {
  if (x.length !== y.length) {
    return false;
  }
  return y.reduce((pv, cv, index) => pv && cv === x[index], true);
}

export const matrixHasArray = <T> (x: T[][], y: T[]) => {
  return x.reduce((pv, cv) => pv || equalArrays(cv, y), false);
}

export const randomNumber = (a: number, b: number) =>  {
  const s = Math.random();
  const r = a + s*(b-a);
  return r;
}

export const randomInt = (a: number, b: number) => Math.round(randomNumber(a, b));

export const randomString = (size: number) => String.fromCharCode(...initArray(size).map(_ => randomInt(97, 121)));

// function useDebounce(timeout: number = 300) {
//   const anchor = useRef<NodeJS.Timeout>();
//   const run = (callback: any) => {
//     if (anchor.current) {
//       clearTimeout(anchor.current);
//     }
//     anchor.current = setTimeout(() => {
//       console.log(20, anchor.current, 'DONE');
//       callback();
//     }, timeout);
//   }
//   return run;
// }

const useNotFirstEffect = (callback: any, dependencies: any[]) => {
  const started = useRef(false);
  useEffect(() => {
    if (started.current) {
      callback();
    } else {
      started.current = true;
    }
  }, dependencies);
};

export const useCountableEffect = (callback: any, dependencies: any[], limit: number = 2) => {
  const [count, setCount] = useState<number>(0);
  useEffect(() => {
    if (count < limit) {
      callback();
      setCount(count+1);
    }
  }, [...dependencies, count]);
};

export const useEffectAsync = (callback: any, dependencies: any[]) => {
  useEffect(() => {
    callback();
  }, dependencies);
}