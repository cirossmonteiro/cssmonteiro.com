/* 
  draw, save to mogoose, create another component to request from API and render acoording to props received
 */

import { Button, Input } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../../api";
import Editor from "./editor";


export interface IPoint {
  x: number;
  y: number;
  color: string;
}

interface IPixelsArt {
  user: string;
  slug: string;
  size: [number, number];
  hidden: boolean;
  points: IPoint[];
}

const postPixelsArt = async (/*user: string, */title: string, size: [number, number], points: IPoint[]) => {
  const params = { /*user,*/ title, size, points };
  const response = await api.post("/pixels-arts/", params);
  return response.data;
}

const getPixelsArts = async () => {
  const response = await api.get("/pixels-arts");
  return response.data;
}

const PixelsArt = () => {
  const [arts, setArts] = useState<IPixelsArt[]>([]);
  const [title, setTitle] = useState<string>("here");
  const [x, setX] = useState<number>(10);
  const [y, setY] = useState<number>(10);
  const [points, setPoints] = useState<IPoint[]>([{x: 5, y: 5, color: 'red'}]);

  const loadPixelsArts = useCallback(async () => {
    const data = await getPixelsArts();
    setArts(data);
  }, []);

  const newPixelsArt = useCallback(async () => {
    const data = await postPixelsArt(title, [x, y], points);
    console.log(50, data);
  }, [x, y, points, title]);

  useEffect(() => {
    loadPixelsArts();
  }, []);

  const artsJSX = useMemo(() => {
    return arts.map(art => {
      return (
        <Editor points={art.points} size={art.size} />
      )
    });
  }, [arts]);

  console.log(45, arts);

  return (
    <div className="h-100 d-flex flex-column">
      <div>pixels art</div>
      <Editor size={[x, y]} points={points} onChange={setPoints} />
      <Input value={title} onChange={e => setTitle(e.target.value)} />
      <Button onClick={newPixelsArt}>Save</Button>
      {artsJSX}
    </div>
  );
}

export default PixelsArt;