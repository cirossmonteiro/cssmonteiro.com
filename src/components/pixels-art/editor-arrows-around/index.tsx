import { ReactNode, useCallback } from "react";
import { IPoint } from "..";
import ArrowsAround from "../arrows-around";

interface IProps {
  x: number;
  y: number;
  points: IPoint[];
  onChange: (points: IPoint[]) => void;
  children: ReactNode;
}

const EditorArrowsAround = ({
  x, y,
  points,
  onChange,
  children
}: IProps) => {

  const handleMoveToRight = useCallback(() => {
    const newPoints: IPoint[] = [];

    points.forEach(point => {
      const newPoint = { ...point };
      if (newPoint.x < x-1) {
        newPoint.x++;
        newPoints.push(newPoint);
      }
    });

    return onChange(newPoints);
  }, [x, y, points]);

  const handleMoveToLeft = useCallback(() => {
    const newPoints: IPoint[] = [];

    points.forEach(point => {
      const newPoint = { ...point };
      if (0 < newPoint.x) {
        newPoint.x--;
        newPoints.push(newPoint);
      }
    });

    return onChange(newPoints);
  }, [x, y, points]);

  const handleMoveToUp = useCallback(() => {
    const newPoints: IPoint[] = [];

    points.forEach(point => {
      const newPoint = { ...point };
      if (0 < newPoint.y) {
        newPoint.y--;
        newPoints.push(newPoint);
      }
    });

    return onChange(newPoints);
  }, [x, y, points]);

  const handleMoveToDown = useCallback(() => {
    const newPoints: IPoint[] = [];

    points.forEach(point => {
      const newPoint = { ...point };
      if (newPoint.y < y-1) {
        newPoint.y++;
        newPoints.push(newPoint);
      }
    });

    return onChange(newPoints);
  }, [x, y, points]);

  return (
    <ArrowsAround
      onTop={handleMoveToUp}
      onRight={handleMoveToRight}
      onDown={handleMoveToDown}
      onLeft={handleMoveToLeft}
    >
      {children}
    </ArrowsAround>
  );
}

export default EditorArrowsAround;