import { faArrowsLeftRightToLine } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useRef, useState } from "react";
import styled from "styled-components";

interface IProps {
  parts: any[]
}

const DragSplitView = (props: IProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHolding, setIsHolding] = useState<boolean>(false);
  const [percentage, setPercentage] = useState<number>(50);

  const handleMouseMove = useCallback((e: any) => {
    if (isHolding) {
      setPercentage(e.clientX / (ref.current?.clientWidth || 1)*100);
    }
  }, [isHolding]);

  return (
    <Container className="w-100 d-flex"
      onMouseMove={handleMouseMove}
      onMouseUp={_ => setIsHolding(false)}
      ref={ref}
    >
      <Cursor className="d-flex justify-content-center align-items-center"
        width={percentage} onMouseDown={_ => setIsHolding(true)} key={1}>
        <FontAwesomeIcon icon={faArrowsLeftRightToLine} />
      </Cursor>
      <Holder width={percentage} key={2}>
        {props.parts[0]}
      </Holder>
      <Holder width={100-percentage} key={3}>
        {props.parts[1]}
      </Holder>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  user-select: none;
`;

const Cursor = styled.div<{
  width: number;
}>`
  position: absolute;
  width: 45px;
  height: 40px;
  background: white;
  color: #202C33;
  font-size: 30px;
  top: 50%;
  left: calc(${({ width }) => width}% - 20px);
  z-index: 1;
  cursor: pointer;
  border: 1px solid black;
`;

const Holder = styled.div<{
  width: number; // percentage
}>`
  width: ${({ width }) => width}%;
`;

export default DragSplitView;