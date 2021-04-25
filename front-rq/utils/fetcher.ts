import axios from 'axios';

const fetcher = async ({ queryKey }: { queryKey: string }) => {
  const response = await axios.get(queryKey, {
    withCredentials: true,
  });
  return response.data;
};

export default fetcher;
