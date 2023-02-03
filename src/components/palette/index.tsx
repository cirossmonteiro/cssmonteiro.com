import styled from "styled-components";
import { initArray, intToHex } from "../../react-utils/src/utils";

interface IProps {
  x?: number;
  y?: number;
  mode: '#hex';
  setValue: (value: string) => void;
}

const Palette = (props: IProps) => {
  const {
    x = 10,
    y = 10
  } = props;

  const colorsJSX = initArray(y)
  .map((_, j) => (
    <div className="d-flex">
      {initArray(x).map((_, i) => {
        const value = intToHex(Math.floor((i+x*j)/(x*y)*(256**3)));
        return <Element className="cp" value={value} onClick={_ => props.setValue(value)} />
      }
      )}
    </div>
  )); // to-think: can use Math.round ?
  
  return (
    <div className="d-flex flex-column">
      {colorsJSX}
    </div>
  )
}

const Element = styled.div<{
  value: string;
}>`
  width: 15px;
  height: 15px;
  margin: 2px;
  border: 1px solid black;
  background: ${({ value }) => value};
`;

export default Palette;