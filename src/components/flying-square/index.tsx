import { ReactNode, useEffect, useState } from "react";
import styled from "styled-components";

interface IProps {
  children: ReactNode;
  amount?: number;
  className?: string;
}

const MAX = 100;
const STEP = 0.01;
const SIZE = 10;

const computePos = (pos: number): [number, number] => {
  if (0 <= pos && pos <= 0.25) {
    return [pos/0.25, 0];
  } else if (0.25 <= pos && pos <= 0.5) {
    return [1, (pos-0.25)/0.25];
  } else if (0.5 <= pos && pos <= 0.75) {
    return [(0.75-pos)/0.25, 1];
  } else {
    return [0, (1-pos)/0.25];
  }
}

const FlyingSquare = (props: IProps) => {
  const [total, setTotal] = useState<number>(0);
  const [pos, setPos] = useState<number[]>([]);

  useEffect(() => {
    const id = setInterval(() => {
      setPos(p => {
        while (p.length !== total){
          if (p.length < total) {
            p.push(0);
          } else if (p.length > total) {
            p.pop();
          }
        }
        return p.map(n => n >= 1 ? 0 : n+STEP);
      });
    }, 30);

    return () => {
      clearInterval(id);
    }
  }, [total]);

  useEffect(() => {
    setTotal(props.amount || 1);
  }, [props.amount]);

  return (
    <Container className={`${props?.className || ""} position-relative d-inline-flex`}>
      {pos.map(p => computePos(p)).map((p, index) =>
        <Square key={index} className="position-absolute dynamic-background-primary"
          left={p[0]} top={p[1]} />
        )}
      {props.children}
    </Container>
  );
}

const Container = styled.div`
  width: fit-content;
`;

const Square = styled.div<{
  left: number;
  top: number;
}>`
  width: ${SIZE}px;
  height: ${SIZE}px;
  background: black;
  left: calc(${({ left }) => left*MAX}% - ${({ left }) => (1-left)*SIZE}px);
  top: calc(${({ top }) => top*MAX}% - ${({ top }) => (1-top)*SIZE}px);
`;

export default FlyingSquare;