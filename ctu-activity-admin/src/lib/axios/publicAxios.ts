import axios from "axios";

const publicAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BACKEND_URL,
  withCredentials: true,
});

publicAxios.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return error?.response?.data ?? Promise.reject(error);
  },
);

export default publicAxios;
