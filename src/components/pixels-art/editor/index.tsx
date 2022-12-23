import { useCallback, useState } from "react";
import styled from "styled-components";
import { IPoint } from "..";
import { initArray } from "../../../utils";


interface IProps {
  points: IPoint[];
  onChange?: (points: IPoint[]) => void;
  size: [number, number];
  rect: [number, number];
  brushSize: number;
}



const Editor = ({
  points,
  onChange,
  size: [x,y],
  rect: [width, height],
  brushSize
}: IProps) => {

  const [pressed, setPressed] = useState<boolean>(false);

  const handleMouseOver = useCallback((i: number, j: number, alreadyPressed: boolean = false) => () => {
    if ((pressed || alreadyPressed) && onChange) {
      const index = points.findIndex(p => p.x === i && p.y === j);
      const newPoints = [];

      for (let a = i - brushSize; a < i + brushSize + 1; a++) {
        for (let b = j - brushSize; b < j + brushSize + 1; b++) {
          const alreadyExists = points.find(point => point.x === a && point.x === y);
          if (0 <= a && a < x && 0 <= b && b < y && !alreadyExists) {
            newPoints.push({ x: a, y: b, color: 'red' });
          }
        }
      }

      onChange([ ...points, ...newPoints ]);
    }
  }, [pressed, points]);

  const renderJSX = initArray(y)
    .map(j => {
      return (
        <div className="d-flex" key={j}>
          {initArray(x).map(i => {
            const active = !!points.find(p => p.x === i && p.y === j) || false;
            return (
              <Element key={`${i}-${j}`} width={width} height={height} active={active}
                onMouseOver={handleMouseOver(i, j)}
                onMouseDown={handleMouseOver(i, j, true)}
              />
            );
          })}
        </div>
      );
    });

  return (
    <Main onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)} onMouseLeave={() => setPressed(false)}>
      {renderJSX}
    </Main>
  );
}

const Main = styled.div`
  * {
    user-drag: none;
  }
`

const Element = styled.div<{
  active: boolean;
  width: number;
  height: number;
}>`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  background: ${({ active }) => active ? 'red' : 'white'};
  border: 1px solid black;
`;

export default Editor;