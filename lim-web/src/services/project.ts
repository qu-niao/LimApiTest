import { limRequest } from '@/utils/request';
import { request } from 'umi';
const PREFIX = '/project/';

export function projectView(type: string, params: number | object = {}) {
  return limRequest(PREFIX + 'project-view', params, type);
}
export function projectEnvirData(params: object = {}) {
  if (params) {
    return request<any>(PREFIX + 'project-envir-data', { params });
  }
  return request<any>(PREFIX + 'project-envir-data');
}
export function projectOverView(params: any = {}) {
  return request<any>(PREFIX + 'project-overview', { params });
}
export function projectHaveEnvir(params: object) {
  return request<any>(PREFIX + 'project-have-envir', { params });
}
export function testDbConnect(params: object) {
  return request<any>(PREFIX + 'test-db-connect', {
    method: 'POST',
    data: params,
  });
}
export function getProjDbDatabase(params: object) {
  return request<any>(PREFIX + 'proj-db-database', {
    method: 'POST',
    data: params,
  });
}
export function runSql(params: object) {
  return request<any>(PREFIX + 'run-sql', {
    method: 'POST',
    data: params,
  });
}
export function getIndexStatistics() {
  return request<any>(PREFIX + 'get-index-statistics');
}
