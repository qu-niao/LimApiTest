import { JSONPrase } from '@/utils/utils';

export const paramsTableToJson = (data: any) => {
  let value = {};
  if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      const type = data[i].type.type;
      if (type !== 'string') {
        value[data[i].name] = JSONPrase(data[i].value);
      } else {
        value[data[i].name] = data[i].value.toString();
      }
    }
  }

  return value;
};
export const parseCascaderJson = (value: any) => {
  if (['object', 'boolean'].includes(typeof value)) {
    return JSON.stringify(value);
  }
  return value;
};
export const paramsJsonToTable = (data: any, fixType: string | null = null) => {
  let value: any = [];
  let editKeys = [];
  let rowKey = Date.now();
  for (let key in data) {
    editKeys.push(rowKey);
    value.push({
      id: rowKey,
      name: key,
      value: parseCascaderJson(data[key]),
      type: { type: fixType || typeof data[key], auto: true },
    });
    rowKey += 1;
  }

  return [value, editKeys];
};
