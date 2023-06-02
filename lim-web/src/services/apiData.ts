import { limRequest } from '@/utils/request';
import { request } from 'umi';
const PREFIX = '/api-data/';

export function caseModuleView(type: string, params: number | object = {}) {
  return limRequest(PREFIX + 'case-module-view', params, type);
}
export function apiModuleView(type: string, params: number | object = {}) {
  return limRequest(PREFIX + 'api-module-view', params, type);
}
export function treeCaseModule(params: any = {}) {
  return request<any>(PREFIX + 'tree-case-module', { params });
}
export function treeCascaderModuleCase(params: any = {}) {
  return request<any>(PREFIX + 'tree-cascader-module-case', { params });
}
export function treeApiModule(params: any = {}) {
  return request<any>(PREFIX + 'tree-api-module', { params });
}
export function caseView(type: string, params: number | object = {}) {
  return limRequest(PREFIX + 'case-view', params, type);
}
export function apiDataView(type: string, params: number | object = {}) {
  return limRequest(PREFIX + 'api-view', params, type);
}
export function searchApi(params: object = {}) {
  return request<any>(PREFIX + 'search-api', { params });
}
export function runApiCases(params: object) {
  return request<any>(PREFIX + 'run-api-cases', {
    method: 'POST',
    data: params,
  });
}
export function runApiStep(params: object) {
  return request<any>(PREFIX + 'run-api-case-step', {
    method: 'POST',
    data: params,
  });
}
export function getForeachStep(params: object = {}) {
  return request<any>(PREFIX + 'get-foreach-step', { params });
}
export function stopCasing() {
  return request<any>(PREFIX + 'stop-casing', {
    method: 'POST',
  });
}
export function copyCases(params: object) {
  return request<any>(PREFIX + 'copy-cases', {
    method: 'POST',
    data: params,
  });
}
export function mergeCases(params: object) {
  return request<any>(PREFIX + 'merge-cases', {
    method: 'POST',
    data: params,
  });
}
export function copyStepToOtherCase(params: object) {
  return request<any>(PREFIX + 'copy-step-to-other-case', {
    method: 'POST',
    data: params,
  });
}
export function testApiData(params: object) {
  return request<any>(PREFIX + 'test-api-data', {
    method: 'POST',
    data: params,
  });
}
export function searchCaseByApi(_: string, params: object) {
  //必须两个参数，要适配组件
  return request<any>(PREFIX + 'search-case-by-api', { params });
}
export function getApiReport(params: object) {
  return request<any>(PREFIX + 'api-report', { params });
}

export function caseSortList(params: object) {
  return request<any>(PREFIX + 'case-sort-list', { params });
}
export function setCasePosition(params: object) {
  return request<any>(PREFIX + 'set-case-position', {
    method: 'POST',
    data: params,
  });
}
export function cleanDeletedCases() {
  return request<any>(PREFIX + 'clean-deleted-cases', {
    method: 'DELETE',
  });
}
