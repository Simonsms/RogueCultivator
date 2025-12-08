import axios, {
  type AxiosInstance,
  type AxiosError,
  type AxiosResponse,
} from "axios";

/**
 * API 响应数据结构
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * 创建 Axios 实例
 */
const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * 响应拦截器
 * 统一处理响应数据和错误
 */
request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { data } = response;
    // 直接返回响应数据
    return data as any;
  },
  (error: AxiosError<ApiResponse>) => {
    // 处理 HTTP 错误状态码
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 404:
          console.error("请求的资源不存在");
          break;
        case 500:
          console.error("服务器错误");
          break;
        default:
          console.error("请求失败:", data?.message || "未知错误");
      }

      // 返回后端的错误信息
      return Promise.reject(data || error);
    }

    // 网络错误或超时
    if (error.message.includes("timeout")) {
      console.error("请求超时，请检查网络连接");
    } else if (error.message.includes("Network Error")) {
      console.error("网络错误，请检查网络连接");
    }

    return Promise.reject(error);
  }
);

export default request;
