import { RequestConfig } from 'umi';
import { message, notification } from 'antd';
import '@/utils/drag'; //拖拽
import { HOST_SERVER } from '@/utils/constant';

message.config({
  top: 100,
  duration: 1,
  maxCount: 2,
});

export const request: RequestConfig = {
  prefix: HOST_SERVER, //服务器请求地址
  credentials: 'include',

  // 自定义错误规范
  errorConfig: {
    adaptor: (res) => {
      return {
        success: res.success, //success为失败的时候会走errorHandler
        data: res.results,
        errorCode: res.code,
        errorMessage: res.msg,
      };
    },
  },
  errorHandler: (error: { response: any }): any => {
    const { response } = error;
    if (response) {
      response.code === 401 ? document.getElementById('login')?.click() : message.error(response.msg);
    } else {
      notification.error({
        description: '您的网络发生异常，无法连接服务器!',
        message: '网络异常',
      });
    }
    return Promise.reject(response);
  },
  requestInterceptors: [
    function authHeaderInterceptor(url: string, options: any) {
      const authHeader = {
        'content-type': 'application/json',
        Authorization: localStorage.getItem('token') ? `Token ${localStorage.getItem('token')}` : '',
      };
      const headers = Object.keys(options.headers).length ? options.headers : authHeader;
      return {
        url: `${url}`,
        options: {
          ...options,
          interceptors: true,
          headers: headers,
        },
      };
    },
  ],
};
