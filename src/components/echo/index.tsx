import { Button, Form, Input } from "antd";
import { useCallback, useState } from "react";
import styled from "styled-components";

import Clock from "./clock";
import useWebSocketEcho from "./useWebSocketEcho";
import { initArray, randomString } from "../../utils";


interface IMessage {
  text: string;
}

const Echo = () => {
  const {
    list, sendText, clearList
  } = useWebSocketEcho<IMessage>("localhost:4000/ws/echo", "main", {
    loadOldMessages: true
  });
  const [typingText, setText] = useState<string>("asdasdsad");

  const handleSend = useCallback(() => {
    const randomSize = Math.round(Math.random() * 45) + 10;
    sendText(typingText);
    setText(randomString(randomSize));
  }, [typingText]);

  return (
    <div className="d-flex flex-column align-items-center">
      <div className="w-75 d-flex flex-column">
        <div className="mb-2 d-flex">
          <Form.Item label="Text">
            <Input value={typingText} onChange={e => setText(e.target.value)} />
          </Form.Item>
          <Button className="ms-2" onClick={handleSend}>send</Button>
          <Button className="ms-2" onClick={clearList}>clear</Button>
        </div>
        <Container >
          {list.map(({ createdAt, data }, index) => {
            return (
              <div key={index} className="ms-1 mt-1 mb-2 d-flex">
                <Clock hour={createdAt.getHours()} minute={createdAt.getMinutes()} />
                <span className="mx-1">-</span>
                <span>{data.text}</span>
              </div>
            );
          })}
        </Container>
      </div>
    </div>
  )
}

const Container = styled.div`
  max-width: 500px;
  height: 500px;
  overflow: auto;
  border: 1px solid gray;
`;

export default Echo;