import axios from 'axios';

const fetcherInfinite = async ({ pageParam = 0 }: { queryKey: string }) => {
  const response = await axios.get(queryKey, {
    withCredentials: true,
  });
  return response.data;
};

export default fetcherInfinite;
