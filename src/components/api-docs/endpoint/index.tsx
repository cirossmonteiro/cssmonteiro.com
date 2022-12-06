import { Button, Form, Input } from "antd";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";
import API from "../../../api";
import { IEndpoint } from "../endpoints";

interface IProps extends IEndpoint {
  className?: string;
};

// to-do: more colors from: https://www.dreamfactory.com/features/api-documentation/ (visited at dec 5, 22)
const MAP_METHOD_COLOR = {
  GET: {
    PRIMARY: "#61AFFF",
    SECONDARY: "#E9F2FA"
  },
  POST: {
    PRIMARY: "#49CC8F",
    SECONDARY: "#E6F5F0"
  }
}

const Endpoint = (props: IProps) => {
  const [responseData, setResponseData] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>();

  const { handleSubmit, control, reset } = useForm<{ [params: string]: string; }>({
    defaultValues: props.example
  });

  const handleRequest = useCallback(async (values: { [params: string]: string; }) => {
    if (isLoading && abortControllerRef.current) {
      (abortControllerRef.current as any).abort();
    } else {
      const params: { [params: string]: string; } = {};
      let url = props.path.slice();
      Object.keys(values).forEach(key => {
        const value = values[key];
        if(url.includes(`:${key}`)) {
          url = url.replace(`:${key}`, value);
        } else {
          params[key] = value;
        }
      });
      abortControllerRef.current = new AbortController();
      setIsLoading(true);
      try {
        const response = await API({
          method: props.method,
          params,
          signal: abortControllerRef.current.signal,
          url
        });
        setResponseData(JSON.stringify(response.data));
      } catch (err) {
        if ((err as any)?.code === "ERR_CANCELED") {
          console.log(`HTTP request's been canceled: ${err}.`);
        } else {
          console.log(`Error HTTP request not handled: ${err}.`);
        }
      }
      setIsLoading(false);
      abortControllerRef.current = null;
    }
    
  }, [props.path, props.method, props.example, isLoading]);

  return (
    <Container className={`p-3 m-2 d-flex flex-column ${props?.className || ''}`} method={props.method}>
      <div className="d-flex align-items-center">
        <div className="py-2 px-4 d-inline-flex method-holder">
          <strong>{props.method}</strong>
        </div>
        <span className="ms-2 path">
          <strong>{props.path}</strong>
        </span>
        <span className="ms-3 description">
          {props.description}
        </span>
      </div>
      
      <Form style={{maxWidth: 200}}
        onFinish={handleSubmit(handleRequest)}>
        <h4 className="mt-2">Test</h4>
        {Object.keys(props?.example || {} ).map(key => {
          return (
            <Form.Item key={key} label={key}>
              <Controller
               name={key}
               control={control}
               rules={{ required: true }}
               render={({ field }) => <Input {...field} />}
              />
            </Form.Item>
          )
        })}
        <Form.Item>
          <Button htmlType="submit">
            {isLoading ? 'Stop' : 'Start'} request
          </Button>
          {isLoading && <FontAwesomeIcon className="ms-2" icon={faSpinner} />}
        </Form.Item>
      </Form>

      <ResponseData className="p-2">
        {responseData}
      </ResponseData>
    </Container>
  )
}

const Container = styled.div<{
  method: 'GET' | 'POST';
}>`
  border: 1px solid ${({ method }) => MAP_METHOD_COLOR[method].PRIMARY};
  border-radius: 5px;
  background: ${({ method }) => MAP_METHOD_COLOR[method].SECONDARY};

  .method-holder {
    color: white;
    background: ${({ method }) => MAP_METHOD_COLOR[method].PRIMARY};
    border-radius: 5px;
  }

  .path {
    font-size: 16px;
    font-family: "Courier New";
    margin-top: 5px;
  }

  .description {
    font-size: 14px;
    margin-top: 2px;
  }
`;

const ResponseData = styled.div`
  border: 1px solid gray;
  overflow: auto;
`;

export default Endpoint;