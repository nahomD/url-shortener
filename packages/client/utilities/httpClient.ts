import axios from 'axios';

export async function fetchGreeting(path: string): Promise<string> {
  const response = await axios.request({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: { Accept: '*/*' },
    method: 'GET',
    url: path,
  });
  return response.data.greeting;
}
