import { useEffect, useRef, useState } from "react";

interface IWSMessage<T> {
  createdAt: Date;
  data: T;
}

interface IOperation {
  type: string;
  raw: any;//{ [key: string]: any };
}

interface useWebSocketEchoOutput<T> {
  list: IWSMessage<T>[];
  sendObj: (obj: Object) => void;
  sendText:(text: string) => void;
  clearList: () => void;
}

interface useWebSocketEchoOptions {
  loadOldMessages?: boolean;
}

const OPERATIONS = {
  ECHO: "ECHO",
  LOAD_MESSAGES: "LOAD_MESSAGES"
}

const useWebSocketEcho = <T>(path: string, room: string, options?: useWebSocketEchoOptions): useWebSocketEchoOutput<T> => {
  const [list, setList] = useState<IWSMessage<T>[]>([]);
  const wsRef = useRef<any>(null);

  useEffect(() => {
    wsRef.current = new WebSocket(`ws://${path}`);
    wsRef.current.onopen = async () => {
      if (options?.loadOldMessages) {
        while (true) {
          await new Promise(r => setTimeout(r, 2000));
          try {
            wsRef.current.send(JSON.stringify({
              room,
              type: OPERATIONS.LOAD_MESSAGES,
            }));
            break;
          } catch {
            continue;
          }
        }
      }

      wsRef.current.onmessage = ({ data: eventData }: any) => {
        const { raw, type }: IOperation = JSON.parse(eventData);
        switch(type) {
          case OPERATIONS.ECHO:
            // if-true to allow using const data
            if (true) {
              const data: any = {
                ...raw,
                createdAt: new Date(raw.createdAt)
              };
              setList(l => [ ...l, data as IWSMessage<T> ]);
            }
            break;

          case OPERATIONS.LOAD_MESSAGES:
            const data = (raw as IWSMessage<T>[]).map(({ createdAt, data }) => ({
              createdAt: new Date(createdAt),
              data
            }));
            setList(l => [ ...l, ...data as IWSMessage<T>[] ]);
            break;

          default:
            throw new Error(`No operation with name provided has been found: ${type}.`);
            break;
        }
      };
    };

    return () => {
      if (wsRef.current.readyState === 1) {
        wsRef.current.close();
      }
    }
  }, []);

  return {
    list,
    sendText: (text: string) => {
      // to-think: why removing extra whitespaces in websocket sending???
      wsRef.current.send(JSON.stringify({
        data: { text },
        room,
        type: OPERATIONS.ECHO,
      }))
    },
    sendObj: (obj: Object) => wsRef.current.send(JSON.stringify(obj)),
    clearList: () => setList([])
  };
}

export default useWebSocketEcho