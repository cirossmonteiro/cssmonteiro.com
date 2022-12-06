import { Button, Form, Input } from "antd";
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import { initArray } from "../../utils";

const X = 50, Y = 50;

interface ICell {
  user?: string;
  color: string;
}

const initialScreen: ICell[][] = initArray(Y).map(() => initArray(X).map(() => ({ color: 'white' })));

const postUser = async (username: string, color: string) => {
  console.log(18, { username, color });
  const response = await axios.post(`http://localhost:4000/users`, { username, color });
  return response.data;
}

const postPoint  = async (user: string, x: number, y: number) => {
  const response = await axios.post(`http://localhost:4000/points`, { user, x, y });
  return response.data;
}

const getUsers = async () => {
  const response = await axios.get(`http://localhost:4000/users`);
  return response.data;
}

const getPoints = async () => {
  const response = await axios.get(`http://localhost:4000/points`);
  return response.data;
}

const BigWall = () => {

  const [users, setUsers] = useState<any[]>([]);
  const [points, setPoints] = useState<any[]>([]);
  const [screen, setScreen] = useState<ICell[][]>(initialScreen);
  const [username, setUser] = useState<string>('me');
  const [color, setColor] = useState<string>('red');
  const [objectId, setObjectId] = useState<string>('');

  useEffect(() => {
    // to-do: executing twice
    (async () => {
      const [users, points] = await Promise.all([
        getUsers(),
        getPoints()
      ]);
      setUsers(users);
      setUsers(points);
    })();
  }, []);

  useEffect(() => {
    const user = users.find(u => u.username === username && u.color === color);
    if (user) {
      setObjectId(user._id);
    }
  }, [users]);

  console.log(57, 1, objectId);

  const handleClick = useCallback((x: number, y: number) => async () => {
    console.log(57, objectId,x,y);
    if (objectId === '') {
      return;
    } else {
      await postPoint(objectId, x, y);
    }
  }, [objectId]);

  const screenJSX = useMemo(() => screen.map((row, y) => {
    return (
      <div key={y} className="d-flex">
        {row.map((cell, x) => {
          // const point
          return <Cell key={x} className="d-inline" color={cell.color} onClick={handleClick(x, y)} />;
        })}
      </div>
    );
  }), [objectId]);

  const handleFinish = useCallback(async (values: any) => {
    console.log(45, values);
    const data = await postUser(values.username, values.color);
    console.log(46, data);
  }, []);

  // to-do: fetch with objectid

  return (
    <Main className="w-100 h-100 d-flex justify-content-center align-items-center">
      <div className="d-flex flex-column">
        <Form onFinish={handleFinish} initialValues={{ username, color }}>
          <Form.Item name="username" label="Username">
            <Input value={username} />
          </Form.Item>
          <Form.Item name="color" label="Color">
            <Input value={color} />
          </Form.Item>
          <Button htmlType="submit">
            get ObjectId
          </Button>
        </Form>
        <Input value={objectId} readOnly/>
      </div>
      <div className="d-flex flex-column">
        {screenJSX}
      </div>
    </Main>
  )
}

const Main = styled.div`
  background: #1A8CD8;
`;

const Cell = styled.div<{
  color: string;
}>`
  min-width: 10px;
  min-height: 10px;
  background: ${({ color }) => color};
  border: 1px solid black;
`;

export default BigWall;