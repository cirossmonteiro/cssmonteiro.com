import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4000/api"
});

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
export const startJob = async (jobId: string, callback: (data: any) => void) => {
  const ws = new WebSocket(`ws://localhost:4000/ws`);
  ws.onopen = () => {
    ws.send(JSON.stringify({ jobId }));
  };
  ws.onmessage = ({ data }) => {
    callback(data);
    ws.close();
  };
  // return new Promise()
}