import { useAuthStore } from "@/stores/authStore";
import axios from "axios";
import { Mutex } from "async-mutex";
import { IBackendRes } from "@/types/backend.type";

const mutex = new Mutex();
const NO_RETRY_HEADER = "x-no-retry";

const privateAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BACKEND_URL,
  withCredentials: true,
});

const handleRefreshToken = async (): Promise<string | null> => {
  return await mutex.runExclusive(async () => {
    try {
      const res = (await privateAxios.post("/auth/refresh-token")) as IBackendRes<{
        accessToken: string;
        user: any;
      }>;
      if (res && res.statusCode === 200 && res.data) {
        return res.data?.accessToken;
      } else return null;
    } catch (error) {
      return null;
    }
  });
};

privateAxios.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

privateAxios.interceptors.response.use(
  (response) => {
    return response.data;
  },

  async (error) => {
    if (
      error.config &&
      error.response &&
      +error.response.status === 401 &&
      error.config.url !== "/auth/login" &&
      !error.config.headers[NO_RETRY_HEADER]
    ) {
      const accessToken = await handleRefreshToken();
      error.config.headers[NO_RETRY_HEADER] = "true";
      if (accessToken) {
        error.config.headers["Authorization"] = `Bearer ${accessToken}`;
        useAuthStore.setState({ accessToken: accessToken });
        return privateAxios.request(error.config);
      }
    }

    if (
      error.config &&
      error.response &&
      +error.response.status === 401 &&
      error.config.url === "/auth/refresh-token"
    ) {
      const message =
        error?.response?.data?.message ?? "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập.";
      useAuthStore.getState().setRefreshTokenAction(true, message);
    }
    return error?.response?.data ?? Promise.reject(error);
  },
);

export default privateAxios;
