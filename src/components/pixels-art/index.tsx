/* 
  draw, save to mogoose, create another component to request from API and render acoording to props received
 */

import { Button, Col, Form, Input, Popconfirm, Radio, Row } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import api from "../../api";
import Editor from "./editor";
import EditorArrowsAround from "./editor-arrows-around";


export interface IPoint {
  x: number;
  y: number;
  color: string;
}

interface IPixelsArtRequired {
  title: string;
  size: [number, number];
  rect: [number, number];
}

interface IPixelsArt extends IPixelsArtRequired {
  // user: string;
  // slug: string;
  hidden?: boolean;
  points?: IPoint[];
}

const putPixelsArt = async (id: string, params: IPixelsArt) => {
  const response = await api.put(`/pixels-arts/${id}`, params);
  return response.data;
}

const postPixelsArt = async (params: IPixelsArt) => {
  const response = await api.post("/pixels-arts/", params);
  return response.data;
}

const getPixelsArts = async (id: string = "") => {
  const response = await api.get(`/pixels-arts/${id}`);
  return response.data;
}

const PixelsArt = () => {
  const { id } = useParams();
  
  const [brushSize, setBrushSize] = useState<number>(0);

  const [title, setTitle]   = useState<string>("here");
  const [x, setX]           = useState<number>(30);
  const [y, setY]           = useState<number>(30);
  const [width, setWidth]   = useState<number>(10);
  const [height, setHeight] = useState<number>(10);
  const [points, setPoints] = useState<IPoint[]>([]);

  const loadPixelsArts = useCallback(async () => {
    const row = await getPixelsArts(id);
    if (id) {
      setTitle(row.title);
      setX(row.size[0]);
      setY(row.size[1]);
      setWidth(row.rect[0]);
      setHeight(row.rect[1]);
      setPoints(row.points);
    }
  }, [id]);

  const savePixelsArt = useCallback(async () => {
    if (id) {
      await putPixelsArt(id, { title, size: [x, y], rect: [width, height], points });
    } else {
      await postPixelsArt({ title, size: [x, y], rect: [width, height], points });
    }
  }, [id, x, y, width, height, title, points]);

  useEffect(() => {
    loadPixelsArts();
  }, [id]);

  return (
    <div className="h-100 d-flex flex-column align-items-center">
      <div>pixels art</div>
      <StyledForm className="p-3 mb-5">

        <Form.Item label="Title">
          <Input value={title} onChange={e => setTitle(e.target.value)} />
        </Form.Item>

        <Row gutter={10}>
          <Col span={6}>
            <Form.Item label="Grid-x">
              <Input value={x} type="number" min={1} onChange={e => setX(parseInt(e.target.value))} />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label="Grid-y">
              <Input value={y} type="number" min={1} onChange={e => setY(parseInt(e.target.value))} />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label="Rect-x">
              <Input value={width} type="number" min={1} onChange={e => setWidth(parseInt(e.target.value))} />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label="Rect-y">
              <Input value={height} type="number" min={1} onChange={e => setHeight(parseInt(e.target.value))} />
            </Form.Item>
          </Col>
        </Row>

        {!id && (<>
          <Form.Item>
            <Button onClick={savePixelsArt}>create design</Button>
          </Form.Item>
        </>)}

        {id && (<>

          <Form.Item label="size of brush">
            <Radio.Group value={brushSize} onChange={e => setBrushSize(e.target.value)}>
              <Radio value={0}>small</Radio>
              <Radio value={1}>medium</Radio>
              <Radio value={2}>big</Radio>
            </Radio.Group>
          </Form.Item>
          
          <EditorArrowsAround onChange={setPoints} points={points} x={x} y={y}>
            <Editor size={[x, y]} rect={[width, height]} points={points} onChange={setPoints}
              brushSize={brushSize} />
          </EditorArrowsAround>

          <Row className="mt-3">
            <Form.Item>
              <Popconfirm description="Are you sure to clear this design?" title="Reseting design" onConfirm={() => setPoints([])}>
                <Button>clear</Button>
              </Popconfirm>
            </Form.Item>

            <Form.Item className="ms-3">
              <Popconfirm description="Are you sure to undo last changes?" title="Undoing changes" onConfirm={() => loadPixelsArts()}>
                <Button>undo</Button>
              </Popconfirm>
            </Form.Item>

            <Form.Item className="ms-3">
              <Button onClick={savePixelsArt}>save design</Button>
            </Form.Item>
          </Row>

        </>)}

      </StyledForm>

      
      
    </div>
  );

  
}

const StyledForm = styled(Form)`
  max-width: 500px;
  border: 1px solid black;
`

export default PixelsArt;