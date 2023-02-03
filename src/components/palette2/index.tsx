import { useCallback, useMemo, useState } from "react";
import styled from "styled-components";

import { addLeadingZeros } from "../../react-utils/src/utils";

interface TColor {
  red: number;
  green: number;
  blue: number;
}

type TArrColor = [number, number, number];

interface IProps {
  value: TArrColor
  onChange: (color: TArrColor) => void;
}

// to-do: improve dropdown UI

const rgbObjToHex = (value: TColor) => {
  const hexRed = addLeadingZeros(value.red.toString(16), 2),
        hexGreen = addLeadingZeros(value.green.toString(16), 2),
        hexBlue = addLeadingZeros(value.blue.toString(16), 2);
  return `#${hexRed}${hexGreen}${hexBlue}`;
}

export const rgbArrToHex = (value: [number, number, number]) => {
  return rgbObjToHex({ red: value[0], green: value[1], blue: value[2] });
}

const hexToRGBArr = (value: string) => {
  const hex = parseInt(value.slice(1), 16);
  const red = Math.floor(hex / 256**2),
      green = Math.floor((hex % 256**2) / 256),
      blue = hex % 256;
  return [red, green, blue];
}

const rgbArrToHex2 = (value : TArrColor) => {
  const [red, green, blue] = value;
  const hexRed = addLeadingZeros(red.toString(16), 2),
        hexGreen = addLeadingZeros(green.toString(16), 2),
        hexBlue = addLeadingZeros(blue.toString(16), 2);
  return `#${hexRed}${hexGreen}${hexBlue}`;
}

const Palette2 = (props: IProps) => {

  const [open, setOpen] = useState<boolean>(false);
  const [red, green, blue] = props.value;

  const inputProps = useMemo(() => {
    const commons = {
      min: 0,
      max: 255,
      type: "range",
      className: "w-100"
    }
    return {
      red: {
        ...commons,
        value: red,
        onChange: (e: any) => props.onChange([parseInt(e.target.value), green, blue])
      },
      green: {
        ...commons,
        value: green,
        onChange: (e: any) => props.onChange([red, parseInt(e.target.value), blue])
      },
      blue: {
        ...commons,
        value: blue,
        onChange: (e: any) => props.onChange([red, green, parseInt(e.target.value)])
      }
    }
  }, [red, green, blue]);

  const handleClose = useCallback((e: any) => {
    e.stopPropagation();
    setOpen(false);
  }, []);

  const handleOpen = useCallback(() => {
    if (!open) {
      setOpen(true);
    }
  }, [open]);

  const rgbStr = rgbArrToHex(props.value);
  
  return (
    <Main onClick={handleOpen}>
      <Dropdown open={open} className="p-2 d-flex flex-column">
        <LabelColor color={rgbStr}>{rgbStr}</LabelColor>
        {open && (
          <>
            <label>
              red<input {...inputProps.red} />
            </label>
            <label>
              green<input {...inputProps.green} />
            </label>
            <label>
              blue<input {...inputProps.blue} />
            </label>
            <button onClick={handleClose}>close</button>
          </>
        )}
      </Dropdown>
    </Main>
  )
}

const Main = styled.div`
  position: relative;
  label {
    color: black;
  }
`;

const Dropdown = styled.div<{
  open: boolean
}>`
  position: ${({ open }) => open ? 'absolute' : 'static'};
  z-index: 1;
  background: ${({ open }) => open ? 'white' : 'transparent'};
  input:first-child {
    width: 75px;
    background: transparent;
  }
  button {
    color: black;
  }
`

const LabelColor = styled.span<{
  color: string;
}>`
  color: ${({ color }) => color};
`

export default Palette2;