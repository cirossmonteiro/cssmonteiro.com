export const ENDPOINTS: IEndpoint[] = [
  {
    method: "GET",
    path: "/selenium/twitter/:username",
    description: "Retrieve basic information from Twitter user's profile.",
    example: {
      username: "bbc"
    },
    ui: "/#/twitter.com/:username"
  },
  {
    method: "GET",
    path: "/selenium/medium/:username",
    description: "Retrieve basic information from Medium user's profile.",
    example: {
      username: "dan_abramov"
    }
  },
  {
    method: "GET",
    path: "/selenium/tiktok/:username",
    description: "Retrieve basic information from Tiktok user's profile.",
    example: {
      username: "bbc"
    }
  }
]

export interface IEndpoint {
  method: 'GET' | 'POST';
  path: string;
  description: string;
  example?: { [params: string]: string; };
  ui?: string;
}