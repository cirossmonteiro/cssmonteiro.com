import { v4 as uuid4 } from 'uuid';

class WSInterceptorManager {
  handlers: ((event: MessageEvent | string) => MessageEvent | string)[];
  
  constructor() {
    this.handlers = [];
  }

  /**
   * Add a new interceptor to the stack
   */
  use(fn: (event: MessageEvent | string) => (MessageEvent | string)) {
    this.handlers.push(fn);
  }

  compute(event: MessageEvent | string) {
    this.handlers.forEach(handler => {
      event = handler(event);
    });
    return event;
  }
}


class WebSocketManager {
  baseUrl: string;
  interceptors: {
    onmessage: WSInterceptorManager;
    send: WSInterceptorManager;
  };
  instances: any[];

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.instances = [];
    this.interceptors = {
      onmessage: new WSInterceptorManager(),
      send: new WSInterceptorManager()
    };
  }

  findInstance(id: string) {
    return this.instances.find(i => i.id === id);
  }

  closeInstance(id: string) {
    this.findInstance(id).instance.close();
    this.instances = this.instances.filter(i => i.id !== id)
  }

  newInstance(path: string) {
    const currentId = uuid4();
    const instance = new WebSocket(`${this.baseUrl}${path}`);
    
    this.instances.push({
      id: currentId,
      instance      
    });

    const setOnmessageHandler = (id: string, evHandler: any) => {
      this.findInstance(id).instance.onmessage = (event: MessageEvent) => {
        event = this.interceptors.onmessage.compute(event) as MessageEvent;
        evHandler(event);
      }
    }

    const setOnopenHandler = (id: string, evHandler: any) => {
      this.findInstance(id).instance.onopen = evHandler;
    }

    const setOnerrorHandler = (id: string, evHandler: any) => {
      this.findInstance(id).instance.onerror = evHandler;
    }

    const send = (id: string, event: string) => {
      event = this.interceptors.send.compute(event) as string;
      this.findInstance(id).instance.send(event);
    }

    const close = (id: string) => {
      this.closeInstance(id);
    }

    return {
      set onmessage(evHandler: any) {
        setOnmessageHandler(currentId, evHandler);
      },
      set onopen(evHandler: any) {
        setOnopenHandler(currentId, evHandler);
      },
      set onerror(evHandler: any) {
        setOnerrorHandler(currentId, evHandler);
      },
      send: (message: string) => {
        send(currentId, message);
      },
      close: () => {
        close(currentId);
      }
    };
  }
}

export const WebSocket2 = new WebSocketManager("ws://localhost:4000/ws");
