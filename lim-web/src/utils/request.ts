import { request } from 'umi';
import { GET, DELETE } from '@/utils/constant';
export function limRequest(url: string, params: object | number | string, type: string) {
  if ([GET, DELETE].includes(type)) {
    let reqParams = { method: type };
    reqParams['params'] = typeof params === 'object' ? params : { id: params };
    return request(url, reqParams);
  }
  return request(url, {
    method: type,
    data: params,
  });
}
