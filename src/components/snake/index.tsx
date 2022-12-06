import { KeyboardEvent, useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import styled from "styled-components";
import { initArray, matrixHasArray, randomInt } from "../../utils";

const PIVOT_TIME = 300;

type TPosition = [number, number];

type TSnake = TPosition[];

const randomPos = (width: number, height: number): TPosition => {
  return [
    randomInt(0, width-2),
    randomInt(0, height-2),
  ];
}

interface IProps {
  width?: number;
  height?: number;
}

const MAP_COLOR = {
  food: 'red',
  snake: 'green',
  path: 'transparent'
}

const Snake = ({ width = 30, height = 25 }: IProps) => {

  const initialSnake: TSnake = useMemo(() => {
    return [randomPos(width, height)];
  }, [width, height]);

  const id = useRef<NodeJS.Timer>();
  const [dir, setDir] = useState([1, 0]);
  const [snake, setSnake] = useState<TSnake>([[Math.floor(width/2), Math.floor(height/2)]]);
  const [highscore, setHighscore] = useState<number>(1);
  const [food, setFood] = useReducer(_ => randomPos(width, height), randomPos(width, height));

  useEffect(() => {
    if (snake.length > 0) {
      id.current = setInterval(() => {
        setSnake(s => {
          const head = s[0];
          console.log(49, head);
          if (head[0] === -1 || head[1] === -1 || head[0] === width || head[1] === height) {
            console.log(49, 'over');
            setHighscore(snake.length);
            s = [];
          } else if (head[0] === food[0] && head[1] === food[1]) {
            s = [[s[0][0]+dir[0], s[0][1]+dir[1]], ...s];
            setFood();
          } else {
            s = [[s[0][0]+dir[0], s[0][1]+dir[1]], ...s];
            s.pop();
          }
          return s;
        });
      }, PIVOT_TIME/snake.length);

      return () => {
        clearInterval(id.current);
      }
    }
  }, [dir, snake.length, food]);

  useEffect(() => {
    console.log(69, food);
  }, [food]);

  const GameJSX = useMemo(() => initArray(height).map((_, j) => {
    return (
      <div key={j} className="d-flex">{initArray(width).map((_, i) => {
        return <Square key={`${i}-${j}`} type={matrixHasArray<number>(snake, [i, j]) ? 'snake' : (matrixHasArray<number>([food], [i, j]) ? 'food' : 'path')} />
      })}</div>
    );
  }), [snake]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const isGoingVertical = dir[0] === 0,
          isGoingHorizontal = dir[1] === 0;
    switch(e.key) {
      case 'ArrowLeft':
        if (isGoingVertical) {
          setDir([-1, 0]);
        }
        break;
      case 'ArrowRight':
        if (isGoingVertical) {
          setDir([1, 0]);
        }
        break;
      case 'ArrowUp':
        if (isGoingHorizontal) {
          setDir([0, -1]);
        }
        break;
      case 'ArrowDown':
        if (isGoingHorizontal) {
          setDir([0, 1]);
        }
        break;
      default:
        break;
    }
  }, [dir]);

  const resetGame = useCallback(() => {
    setSnake(initialSnake);
    setFood();
  }, []);

  return (
    <div className="h-100 p-5 d-flex flex-column" tabIndex={1}
      onKeyDown={handleKeyDown}>
      <button onClick={resetGame} className="btn btn-primary">reset game</button>
      <span>Current score: {snake.length || 'over'}</span>
      <span>Current highscore: {highscore}</span>
      <Game>
        {GameJSX}
      </Game>
    </div>
  )
}

const Game = styled.div`
  width: fit-content;
  border: 1px solid black;
`;

const Square = styled.div<{
  type: 'snake' | 'food' | 'path';
}>`
  width: 30px;
  height: 30px;
  background: ${({ type }) => MAP_COLOR[type]};
  border: 1px solid yellow;
`;

export default Snake;