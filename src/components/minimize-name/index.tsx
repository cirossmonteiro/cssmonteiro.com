import { useState } from "react";

interface IProps {
  name: string;
}

const MinimizeName = (props: IProps) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <span onMouseEnter={_ => setOpen(true)}
      onMouseLeave={_ => setOpen(false)}>
      {open ? props.name : props.name[0]}
    </span>
  );
}

export default MinimizeName;