import { limRequest } from '@/utils/request';
import { request } from 'umi';
const PREFIX = '/conf/';

export function envirView(type: string, params: number | object = {}) {
  return limRequest(PREFIX + 'envir-view', params, type);
}
export function paramType(params: any = {}) {
  return request<any>(PREFIX + 'param-type', { params });
}
export function changeEnvirPosition(params: any) {
  return request<any>(PREFIX + 'change-envir-position', {
    method: 'POST',
    data: params,
  });
}
