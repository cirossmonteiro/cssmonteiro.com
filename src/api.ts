import axios from "axios";
import { WebSocket2 } from "./websocket2";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4000/api"
});

axiosInstance.interceptors.request.use(request => {
  console.log('REQUEST', request.url);
  return request;
})

axiosInstance.interceptors.response.use(async response => {
  console.log('RESPONSE', response.config.url);
  if (response.config.url?.slice(0, 5) === "/jobs") {
    console.log("JOB ID", response.data.jobId);
    response.data = await startJob(response.data.jobId);
  }
  return response;
})

export default axiosInstance;

export const selenium = {
  twitter: {
    username: async (username: string) => {
      const response = await axiosInstance.get(`/selenium/twitter/${username}`);
      return response.data;
    }
  }
}

// to-think: create interceptor to manage websocket by itself according to "/api/jobs" in path
// to-do: template for this function and data callback
export const startJob = async (jobId: string) => {
  return new Promise((resolve, reject) => {
    const ws = WebSocket2.newInstance("/jobs");
    
    ws.onerror = (event: any) => {
      reject(event);
    };

    ws.onopen = () => {
      ws.send(JSON.stringify({ jobId }));
    };
    
    ws.onmessage = (event: { data: string; }) => {
      const obj = JSON.parse(event.data).data;  
      ws.close();
      resolve(obj);
    };
  });
}