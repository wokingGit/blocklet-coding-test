import { createAxios } from '@blocklet/js-sdk';

const api = createAxios({
  baseURL: window?.blocklet?.prefix || '/',
});

// 添加请求拦截器
api.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    // 设置头部信息和token
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  },
);

// 添加响应拦截器
api.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么

    return response.data;
  },
  (error) => {
    // 对响应错误做点什么

    // 处理响应错误
    console.error('响应错误:', error);

    // 这里可以根据需要统一处理错误
    if (error.response && error.response.status === 401) {
      // 处理 401 错误，例如重新认证
      console.error('Unauthorized, redirecting to login...');
    }
    return Promise.reject(error);
  },
);

export default api;
