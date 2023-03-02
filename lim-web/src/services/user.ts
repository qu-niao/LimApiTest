import { request } from 'umi';
import { limRequest } from '@/utils/request';
const PREFIX = '/user/';
export function login(params: object) {
  return request<any>(PREFIX + 'login', {
    method: 'POST',
    data: params,
    headers: { 'content-type': 'application/json' },
  });
}

export function userView(type: string, params: number | object) {
  return limRequest(PREFIX + 'user-view', params, type);
}
export function userCfgParams() {
  return request<any>(PREFIX + 'user-cfg-params');
}
export function clearUserTempParams() {
  return request<any>(PREFIX + 'clear-user-temp-params', { method: 'DELETE' });
}
export function setUserCfg(params: object) {
  return request<any>(PREFIX + 'set-user-cfg', {
    method: 'POST',
    data: params,
  });
}
export function changePassword(params: object) {
  return request<any>(PREFIX + 'change-password', {
    method: 'POST',
    data: params,
  });
}
