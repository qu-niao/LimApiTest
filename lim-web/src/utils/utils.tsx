import { WAITING_STATUS } from './constant';

export function JSONPrase(data: any) {
  var Fn = Function; //一个变量指向Function，防止有些前端编译工具报错
  try {
    return JSON.parse(data);
  } catch (err: any) {
    console.log('jsonError', err.message);
    return false;
  }
}
export function getValueType(v: any) {
  var Fn = Function; //一个变量指向Function，防止有些前端编译工具报错

  try {
    return typeof JSON.parse(v);
  } catch (err: any) {
    return 'string';
  }
}
export const changeStepEnabled = (id: number, enabled: boolean, tableState: any) => {
  const { dataSource, setDataSource } = tableState;
  dataSource.forEach((item: any) => {
    if (item.id === id) {
      item['enabled'] = enabled;
    }
  });
  setDataSource([...dataSource]);
};
export const deleteStep = (id: number, tableState: any) => {
  const { dataSource, setDataSource } = tableState;
  const idx = dataSource.findIndex((item: any) => item.id === id);
  dataSource.splice(idx, 1);
  setDataSource([...dataSource]);
};
export const copyStep = (record: any, tableState: any) => {
  const { dataSource, setDataSource } = tableState;
  const newRecord = { ...record };
  newRecord.id = Date.now();
  newRecord.status = WAITING_STATUS;
  delete newRecord.results;
  delete newRecord.retried_times;
  dataSource.push(newRecord);
  setDataSource([...dataSource]);
};
//修改步骤状态和执行结果
export const changeStepData = (id: number, tableState: any, res: any) => {
  const { dataSource, setDataSource } = tableState;
  const resData = res.results;
  const idx = dataSource.findIndex((item: any) => item.id === id);
  dataSource[idx].status = resData.status;
  dataSource[idx].results = resData.results || null;
  dataSource[idx].retried_times = resData.retried_times || 0;
  setDataSource([...dataSource]);
};
export const deepCopyJsonArray = (data: any) =>
  data
    ? data.map((item: any) => {
        return { ...item };
      })
    : [];
export const tableRowOnSelect = (
  record: any,
  selected: boolean,
  selectedData: any,
  setSelectedData: Function,
) => {
  let _data = [...selectedData];
  _data = selected ? _data.concat([record]) : _data.filter((item) => item.id !== record.id);
  setSelectedData(_data);
};
export const tableRowOnSelectAll = (
  selected: boolean,
  changeRows: any,
  selectedData: any,
  setSelectedData: Function,
) => {
  const _ids = changeRows.map((item: any) => item.id);
  let _data = [...selectedData];
  _data = selected ? _data.concat(changeRows) : _data.filter((item) => !_ids.includes(item.id));
  setSelectedData(_data);
};
export const getSelectRowLabel = (selectedData: any, nameKey = 'name') => {
  const dataLength = selectedData.length;
  let selPlanLabel = '';
  for (var i = 0; i < dataLength; i++) {
    selPlanLabel += selectedData[i][nameKey] + (i + 1 < dataLength ? ' > ' : '');
  }
  return selPlanLabel;
};
export function onDoubleClick() {
  //双击事件
  let isClick = false;
  let clickNum = 0;
  return function ({ singleClick, doubleClick, params }: any) {
    // 如果没有绑定双击函数，直接执行单击程序
    if (!doubleClick) {
      return singleClick && singleClick(params);
    }

    clickNum++;
    // 毫秒内点击过后阻止执行定时器
    if (isClick) {
      return;
    }
    isClick = true;

    setTimeout(() => {
      // 超过1次都属于双击
      if (clickNum > 1) {
        doubleClick && doubleClick(params);
      } else {
        singleClick && singleClick(params);
      }
      clickNum = 0;
      isClick = false;
    }, 300);
  };
}
//增加视窗变化的监听函数
export const addVisChangeListener = (func: any) => {
  window.addEventListener('visibilitychange', func);
};
//移除视窗变化的监听函数
export const removeVisChangeListener = (func: any) => {
  window.removeEventListener('visibilitychange', func);
};