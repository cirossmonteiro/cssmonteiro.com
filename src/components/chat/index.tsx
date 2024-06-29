import { Button, Form, Input } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";


interface IForm {
  contents: string;
  roomname: string;
  username: string;
}

interface IMessage extends IForm {
  timestamp: string; 
}

const Chat = () => {
  const ws = useRef<WebSocket>();

  const [messages, setMessages] = useState<IMessage[]>([]);
  console.log(17, messages);

  const { control, handleSubmit, watch } = useForm<IForm>({
    defaultValues: {
      username: "",
      roomname: "",
      contents: "",
    },
  });

  const roomname = watch("roomname");

  useEffect(() => {
    console.log(7, "useEffect");
    ws.current = new WebSocket("ws://localhost:3001");
    // ws.current = new WebSocket("wss://tspomxmcwe.execute-api.us-east-2.amazonaws.com/production/");
    ws.current.onopen = () => {
      console.log(8, "open here");
      (ws.current as WebSocket).send("Connection established")
    };
    ws.current.onmessage = event => {

    };
    ws.current.onclose = () => {
      console.log(14, "here closed");
      (ws.current as WebSocket).send("line 14 here");
    }
  }, []);

  useEffect(() => {
    if (roomname !== "") {
      (ws.current as WebSocket).send(JSON.stringify({
        action: "FETCH_MESSAGES",
        payload: { roomname }
      }));
    }
  }, [roomname]);

  const onSubmit = (values: any) => {
    console.log(values);
    // (ws.current as WebSocket).send(JSON.stringify({
    //   action: "SEND_MESSAGE",
    //   payload: values
    // }));
  };

  return (
    <div>
      <span>Chat</span>
      <StyledForm onFinish={handleSubmit(onSubmit) as any}>
        <Form.Item label="Username">
          <Controller
            name="username"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
        </Form.Item>
        <Form.Item label="Room name">
          <Controller
            name="username"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
        </Form.Item>
        <Form.Item label="Message">
          <Controller
            name="contents"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit">send</Button>
        </Form.Item>
      </StyledForm>
      <textarea value={messages.join("\n")} readOnly/>
    </div>
  );
}

const StyledForm = styled(Form)`
  width: 200px;
`

export default Chat;