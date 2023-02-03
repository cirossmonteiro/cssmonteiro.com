import { MouseEventHandler, useCallback, useState } from "react";
import styled from "styled-components";
import { IPoint } from "..";
import { initArray } from "../../../react-utils/src/utils";


interface IProps {
  points: IPoint[];
  onChange?: (points: IPoint[]) => void;
  size: [number, number];
  rect: [number, number];
  brushSize: number;
  showGrid?: boolean;
}



const Editor = ({
  points,
  onChange,
  size: [x,y],
  rect: [width, height],
  brushSize,
  showGrid = false
}: IProps) => {

  const [pressed, setPressed] = useState<boolean>(false);
  // to-do: create state for left/right (click); consider using capture

  /*
    remark: to consider the first place being clicked, when pressed's still false,
      because DOM element events are initially triggered from descendent elements
    issue: event.button is not trustworthy when mouse's moving
      source: https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
  */
  const handleMouseOverOrDown = useCallback((i: number, j: number, alreadyPressed: boolean = false) => (e: any) => {
    if ((pressed || alreadyPressed) && onChange) {
      let newPoints = [ ...points ];
      e.preventDefault();
      // setPressed(true)
      
      const mustAdd = e.nativeEvent.button === 0; // left button = 0, right button = 2
      console.log(37, e.nativeEvent.button, e.nativeEvent.buttons);
      console.log(38, e);

      for (let a = i - brushSize; a < i + brushSize + 1; a++) {
        for (let b = j - brushSize; b < j + brushSize + 1; b++) {
          const index = newPoints.findIndex(point => point.x === a && point.y === b);
          console.log(37, mustAdd, index);
          if (mustAdd && 0 <= a && a < x && 0 <= b && b < y && index === -1) {
            newPoints.push({ x: a, y: b, color: 'red' });
          } else if (!mustAdd && index !== -1) {
            newPoints = newPoints.filter(np => !(np.x === a && np.y === b));
          }
        }
      }

      onChange([ ...newPoints ]);
    }
  }, [pressed, points, x, y]);

  const renderJSX = initArray(y)
    .map(j => {
      return (
        <div className="d-flex" key={j}>
          {initArray(x).map(i => {
            const active = !!points.find(p => p.x === i && p.y === j) || false;
            return (
              <Element key={`${i}-${j}`} width={width} height={height} active={active}
                onMouseOver={handleMouseOverOrDown(i, j)} showGrid={showGrid}
                onMouseDown={handleMouseOverOrDown(i, j, true)}
                
              />
            );
          })}
        </div>
      );
    });

  // const handleMousePressing = useCallback((e: MouseEventHandler<HTMLDivElement>) => {

  // }, []);

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
  border: 1px solid black;
`

const Element = styled.div<{
  active: boolean;
  width: number;
  height: number;
  showGrid?: boolean;
}>`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  background: ${({ active }) => active ? 'red' : 'white'};
  ${({ showGrid }) => showGrid ? "border: 1px solid black;" : ""}
`;

export default Editor;