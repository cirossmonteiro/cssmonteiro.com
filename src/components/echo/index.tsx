import { useEffect, useRef, useState } from "react";

type useWebSocketEchoOutput<T> = [
  T[],
  (mess: T) => void
]

const useWebSocketEcho = <T,>(path: string): useWebSocketEchoOutput<T> => {
  const [list, setList] = useState<T[]>([]);
  const wsRef = useRef<any>(null);

  useEffect(() => {
    wsRef.current = new WebSocket(`ws://${path}`);
    wsRef.current.onopen = () => {
      wsRef.current.onmessage = ({ data }: any) => {
        setList(l => [ ...l, JSON.parse(data) ]);
      };
    };
    return () => {
      wsRef.current.close();
    }
  }, []);

  return [
    list,
    (mess: T) => wsRef.current.send(JSON.stringify(mess))
  ]
}

interface IMessage {
  text: string;
}

const Echo = () => {
  const [list, send] = useWebSocketEcho<IMessage>("localhost:4000/ws/echo");
  const [text, setText] = useState<string>("asdasdsad");

  return (
    <div className="d-flex flex-column">
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => send({ text })}>send</button>
      {list.map(({ text }, index) => {
        return (
          <div key={index}>{text}</div>
        );
      })}
    </div>
  )
}

export default Echo;