import { useCallback, useState } from "react";
import styled from "styled-components";
import { IPoint } from "..";
import { initArray } from "../../../utils";


interface IProps {
  points: IPoint[];
  onChange?: (points: IPoint[]) => void;
  size: [number, number];
}


const Editor = (props: IProps) => {
  const { onChange, points } = props;
  const [x, y] = props.size;

  const handleClick = useCallback((i: number, j: number) => () => {
    if (onChange) {
      const index = points.findIndex(p => p.x === i && p.y === j);
      const obj = { x: i, y: j, color: 'red' };
      if (index === -1) {
        points.push(obj);
      } else {
        points[index] = obj; 
      }
      onChange([ ...points ]);
    }
  }, [points]);

  const renderJSX = initArray(y)
  .map(j => {
    return (
      <div className="d-flex" key={j}>
        {initArray(x).map(i => {
          const active = !!points.find(p => p.x === i && p.y === j) || false;
          return (
            <Element key={`${i}-${j}`} active={active} onClick={handleClick(i, j)} />
          );
        })}
      </div>
    );
  });

  return (
    <div>
      editor
      {renderJSX}
    </div>
  );
}

const Element = styled.div<{
  active: boolean;
}>`
  width: 30px;
  height: 30px;
  background: ${({ active }) => active ? 'red' : 'white'};
  border: 1px solid black;
`;

export default Editor;