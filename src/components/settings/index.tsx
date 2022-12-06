import { faGear, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, Form, Input, Row } from "antd";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";
import { Border } from "../../App";

export interface IStyle {
  color: string;
  background: string;
  fontWeight: string;
}

export const initialStyle: IStyle = {
  color: 'black',
  background: 'white',
  fontWeight: 'normal'
}

interface IProps {
  style: IStyle;
  setStyle: (style: IStyle) => void;
  setAmount: (f: (n: number) => number) => void;
}

const dec = (n: number) => n >= 1 ? n-1 : n;

const inc = (n: number) => n+1;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const Settings = (props: IProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const { handleSubmit, control, reset } = useForm<IStyle>({
    defaultValues: props.style
  });

  useEffect(() => {
    reset(props.style);
  }, [props.style]);

  return (
    <Container className="t-0 r-0 position-absolute m-2 p-2 change-border-style dynamic-color"
      color={props.style.color}>
      {!open && <FontAwesomeIcon className="cp" icon={faGear}
        onClick={_ => setOpen(s => !s)} />}
      
      {open && <>
        {/* <Palette /> */}
        <Form className="d-flex flex-column" {...layout}
          onFinish={handleSubmit(props.setStyle)}>

          <Form.Item label="Color">
            <Controller
              name="color"
              control={control}
              rules={{ required: true }}
              render={({ field }) => <Input {...field} />}
            />
          </Form.Item>

          <Form.Item label="Background">
            <Controller
              name="background"
              control={control}
              rules={{ required: true }}
              render={({ field }) => <Input {...field} />}
            />
          </Form.Item>

          <Form.Item label="Font-weight">
            <Controller
              name="fontWeight"
              control={control}
              rules={{ required: true }}
              render={({ field }) => <Input {...field} />}
            />
          </Form.Item>

          <Form.Item>
            <Row>
              <Col span={12}>
                <Button className="w-100" htmlType="submit">update style</Button>
              </Col>
              <Col span={12}>
                <Button className="w-100" onClick={_ => props.setStyle(initialStyle)}>reset</Button>
              </Col>
            </Row>
          </Form.Item>
          
        </Form>
        <div className="d-flex">
          <FontAwesomeIcon icon={faMinus} className="ms-3 p-1 dcb cp" onClick={() => props.setAmount(dec)} />
          <FontAwesomeIcon icon={faPlus} className="ms-5 p-1 dcb cp" onClick={() => props.setAmount(inc)} />
        </div>
        <div className="mt-5">
          <span className="close cp dynamic-color mt-5"
            onClick={_ => setOpen(false)}>
            close
          </span>
        </div>
      </>}
    </Container>
  );
}

const Container = styled.div<{
  color: string;
}>`
  ${({ color }) => Border(color)}
  ${({ color }) => `
    user-select: none;
    .close {
      text-decoration: underline;
    }
  `}
`;

export default Settings;