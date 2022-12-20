/* 

   _
  | |
  |_| = [0,1,2,3,4,5]

    |
    | = [1,2]
   _
   _|
  |_  = [0,1,3,4,6]
   _
   _|
   _| = [0,1,2,3,6]

  |_|
    | = [1,2,5,6]
   _
  |_
   _| = [0,2,3,5,6]
   _
  |_
  |_| = [0,2,3,4,5,6]
   _
  | |
    | = [0,1,2,5]
   _
  |_|
  |_| = [0,1,2,3,4,5,6]
   _
  |_|
   _| = [0,1,2,3,5,6]

*/

import styled from "styled-components";

interface IProps {
  hour: number;
  minute: number;
  size?: number;
}

const NUMBER_WIDTH = "2px";

const ZERO  = [0,1,2,3,4,5],
      ONE   = [1,2],
      TWO   = [0,1,3,4,6],
      THREE = [0,1,2,3,6],
      FOUR  = [1,2,5,6],
      FIVE  = [0,2,3,5,6],
      SIX   = [0,2,3,4,5,6],
      SEVEN = [0,1,2,5],
      EIGHT = [0,1,2,3,4,5,6],
      NINE  = [0,1,2,3,5,6];

const MAP_NUMBERS = [ZERO, ONE, TWO, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT, NINE];

const renderDigit = (size: number) => (digit: number, index: number) => {
  return (
    <DigitContainer className="digit-container" size={size} key={index}>
      {MAP_NUMBERS[digit].map((n, i) => <div className={`digit-part-${n}`} key={i} />)}
    </DigitContainer>
  )
}

const Clock = (props: IProps) => {
  const { size = 20 } = props;
  const hourDigits = [Math.floor(props.hour/10), props.hour%10];
  const minuteDigits = [Math.floor(props.minute/10), props.minute%10];

  return (
    <ClockContainer className="d-flex">
      <div className="d-flex" key="hour">
        {hourDigits.map(renderDigit(size))}
      </div>
      <span className="mx-1">:</span>
      <div className="d-flex" key="minute">
        {minuteDigits.map(renderDigit(size))}
      </div>
    </ClockContainer>
  )
}

const ClockContainer = styled.div`
  .digit-container:nth-child(2) {
    margin-left: 3px;
  }
`;

const DigitContainer = styled.div<{
  size: number;
}>`
  position: relative;
  height: ${({ size }) => size}px;
  width: ${({ size }) => 0.3*size}px;

  & > div {
    position: absolute;
    background: blue;
  }

  .digit-part-0 {
    height: ${NUMBER_WIDTH};
    width: 100%;
  }

  .digit-part-1 {
    height: 50%;
    width: ${NUMBER_WIDTH};
    right: 0;
  }

  .digit-part-2 {
    height: 50%;
    width: ${NUMBER_WIDTH};
    bottom: 0;
    right: 0;
  }

  .digit-part-3 {
    height: ${NUMBER_WIDTH};
    width: 100%;
    bottom: 0;
  }

  .digit-part-4 {
    height: 50%;
    width: ${NUMBER_WIDTH};
    bottom: 0;
  }

  .digit-part-5 {
    height: 50%;
    width: ${NUMBER_WIDTH};
    bottom: 50%;
  }

  .digit-part-6 {
    height: ${NUMBER_WIDTH};
    width: 100%;
    
    bottom: calc(50% - ${NUMBER_WIDTH} / 2);
  }

`

export default Clock;