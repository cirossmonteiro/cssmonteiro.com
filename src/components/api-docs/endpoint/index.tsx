import { Button, Form, Input, Switch } from "antd";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";

import API, { startJob } from "../../../api";
import { IEndpoint } from "../endpoints";
import JSONPrettifier from "../../json-prettifier";
import Loading from "../../loading";

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

type TObj<T=string> = { [params: string]: T; };

const buildParams = (path: string, values: TObj, isJob: boolean): [string, TObj] => {
  const params: TObj = {};
  console.log(411, params, path, values);
  Object.entries(values).forEach(([key, value]) => {
    if(path.includes(`:${key}`)) {
      path = path.replace(`:${key}`, value);
    } else {
      params[key] = value;
    }
  });

  if (isJob) {
    path = `/jobs${path}`;
  }
  console.log(412, params, path, values);
  return [path, params];
}

const Endpoint = (props: IProps) => {
  const [responseData, setResponseData] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isJob, setIsJob] = useState<boolean>(false);
  const [jobId, setJobId] = useState<string>("");
  const abortControllerRef = useRef<AbortController | null>();

  const { handleSubmit, control, reset } = useForm<TObj>({
    defaultValues: props.example
  });

  const handleRequest = useCallback(async (values: TObj) => {
    if (isLoading && abortControllerRef.current) {
      (abortControllerRef.current as any).abort();
    } else {
      const [url, params] = buildParams(props.path, values, isJob);
      abortControllerRef.current = new AbortController();
      setIsLoading(true);
      try {
        const response = await API({
          method: props.method,
          params,
          signal: abortControllerRef.current.signal,
          url
        });
        if (isJob) {
          const { jobId } = response.data;
          setJobId(jobId);
          startJob(jobId, setResponseData);
        } else {
          setResponseData(JSON.stringify(response.data));
        }
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
    
  }, [props.path, props.method, props.example, isLoading, isJob]);

  const handleCopyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(responseData);
  }, [responseData]);

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
        <div className="my-3 d-flex align-items-center">
          <h4 className="m-0">Test</h4>
          <Switch className="ms-2" checked={isJob} onChange={setIsJob} />
          {isJob && <Input className="ms-2" value={jobId} placeholder="jobId" />}
        </div>
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
          {isLoading && <Loading />}
        </Form.Item>
      </Form>

      <ResponseData className="p-2 d-flex">
        <FontAwesomeIcon className="fa-icon me-2" icon={faCopy} onClick={handleCopyToClipboard} />

        {/* {responseData} */}
        {responseData.length !== 0 && <JSONPrettifier obj={JSON.parse(responseData)} options={{ hyperlink: true }} />}
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
  min-height: 50px;
  position: relative;
  border: 1px solid gray;
  overflow: auto;

  .fa-icon {
    position: absolute;
    right: 0;
    cursor: pointer;
  }
`;

export default Endpoint;