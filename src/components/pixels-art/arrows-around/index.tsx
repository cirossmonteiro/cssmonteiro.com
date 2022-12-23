import { faChevronCircleDown, faChevronCircleLeft, faChevronCircleRight, faChevronCircleUp, faChevronDown, faChevronLeft, faChevronRight, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode } from "react";
import styled from "styled-components";

type callback = () => void;

interface IProps {
  onTop?: callback;
  onRight?: callback;
  onDown?: callback;
  onLeft?: callback;
  children: ReactNode;
}

const ArrowsAround = ({
  onTop,
  onRight,
  onDown,
  onLeft,
  children
}: IProps) => {
  return (
    <Container className="p-4 d-inline-flex">
      <FAIcon icon={faChevronUp} onClick={onTop}/>
      <FAIcon icon={faChevronRight} onClick={onRight}/>
      <FAIcon icon={faChevronDown} onClick={onDown}/>
      <FAIcon icon={faChevronLeft} onClick={onLeft}/>
      {children}
    </Container>
  );
}

const Container = styled.div`
  position: relative;
`;

const FAIcon = styled(FontAwesomeIcon)`
  cursor: pointer;
  position: absolute;

  &:nth-child(1) {
    left: 50%;
    top: 0;
  }

  &:nth-child(2) {
    right: 0;
    top: 50%;
  }

  &:nth-child(3) {
    left: 50%;
    bottom: 0;
  }
  
  &:nth-child(4) {
    left: 0;
    top: 50%;
  }
`

export default ArrowsAround;