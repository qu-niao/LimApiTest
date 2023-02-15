import { request } from 'umi';
const PREFIX = '/';
export function putFile(file: File, filePath: string = '') {
  const formData = new FormData();
  formData.append('file', file);
  if (filePath) {
    formData.append('path', filePath);
  }
  return request<any>(PREFIX + 'put-file', {
    method: 'POST',
    data: formData,
    headers: {
      Authorization: localStorage.getItem('token') ? `Token ${localStorage.getItem('token')}` : '',
    },
  });
}
