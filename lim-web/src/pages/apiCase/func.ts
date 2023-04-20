import { message } from 'antd';
import { apiDataView, caseView, getForeachStep } from '@/services/apiData';
import {
  API,
  API_HEADER,
  API_HOST,
  API_VAR,
  PATCH,
  GET,
  POST,
  STEP_TYPE_LABEL,
  WAITING_STATUS,
  TABLE_MODE,
  API_SQL,
  API_CASE,
  API_FOREACH,
} from '@/utils/constant';
import { envirView } from '@/services/conf';
import { projectHaveEnvir } from '@/services/project';

export const showStepForm = async (stepFormState: any, values: any = {}) => {
  console.log('vv', values);
  let newValues = { ...values };
  switch (newValues.type) {
    case API:
      let apiParams = { ...newValues.params };
      delete newValues.params;
      if (newValues.formType === PATCH) {
        const reqParams = { id: apiParams.api_id, is_case: true };
        await apiDataView(GET, reqParams).then((res) => {
          newValues = { ...newValues, params: apiParams, ...res.results };
        });
      }
      stepFormState.setFormWidth(1260);
      break;
    case API_HEADER:
      stepFormState.setFormWidth(1000);
      break;
    case API_VAR:
      await envirView(GET).then((res) => {
        newValues['envirData'] = res.results;
        if (!newValues['params']) {
          newValues['params'] = {};
        }
        res.results?.forEach((item: any) => {
          newValues['params'][`${item.id}_mode`] = newValues.params[`${item.id}_mode`] || TABLE_MODE;
        });
      });
      stepFormState.setFormWidth(1200);
      break;
    case API_HOST:
      await projectHaveEnvir({ type: API_HOST }).then((res) => (newValues['projectEnvirCand'] = res.results));
      stepFormState.setFormWidth(600);
      break;
    case API_SQL:
      await projectHaveEnvir({ type: API_SQL }).then((res) => (newValues['projectEnvirCand'] = res.results));
      stepFormState.setFormWidth(1100);
      break;
    case API_CASE:
      stepFormState.setFormWidth(1200);
      break;
    case API_FOREACH:
      stepFormState.setFormWidth(1200);
      break;
  }
  stepFormState.setFormData(newValues);
  stepFormState.setOpen(true);
};
export const onStepFormOK = async (values: any, tableState: any, stepFormState: any) => {
  const { dataSource, setDataSource } = tableState;
  const formData = stepFormState.formData;
  let saveData: any = {
    type: formData.type,
    enabled: true,
    status: WAITING_STATUS,
    controller_data: formData.controller_data,
  };
  saveData['step_name'] = values.step_name || STEP_TYPE_LABEL[formData.type];
  switch (formData.type) {
    case API_HEADER:
      saveData['params'] = values.value;
      break;
    case API_VAR:
      saveData['params'] = { ...values };
      break;
    case API_HOST:
      saveData['params'] = { host_type: values.host_type, value: values.value };
      break;
    case API:
      let saveValues = { ...values };
      //删除多余的字段
      ['project_id', 'path', 'method', 'step_name', 'timeout'].forEach((key) => delete saveValues[key]);
      saveData['params'] = saveValues;
      saveData['step_name'] = values.step_name || saveValues['name'];
      values.is_case = true;
      await apiDataView(POST, values).then((res) => {
        message.success('操作成功！');
        saveData['params'].api_id = res.results.api_id;
      });
      break;
    case API_SQL:
      delete values.step_name;
      saveData['params'] = values;
      break;
    case API_CASE:
      saveData['params'] = { case_related: values.case_related };
      await caseView(POST, { steps: values.dataSource, id: values.case_related.slice(-1)[0] }).then((res) => {
        message.success('引用用例修改成功！');
      });
      break;
    case API_FOREACH:
      saveData['params'] = { times: values.times, break_code: values.break_code, steps: values.dataSource };
      break;
  }

  if (formData.formType === POST) {
    saveData['id'] = Date.now();
    const rowIndex = formData.rowIndex;
    rowIndex === -1 ? dataSource.push(saveData) : dataSource.splice(rowIndex + 1, 0, saveData);
  } else {
    //修改
    saveData['id'] = formData.id;
    const idx = dataSource.findIndex((item: any) => item.id === formData.id);
    dataSource.splice(idx, 1, saveData);
  }
  setDataSource([...dataSource]);
  stepFormState.setOpen(false);
};
export const showControllerForm = (stepFormState: any, values: any = {}) => {
  stepFormState.setFormData(values);
  stepFormState.setOpen(true);
};
export const onControllerFormOK = async (values: any, tableState: any, stepFormState: any) => {
  const { dataSource, setDataSource } = tableState;
  const formData = stepFormState.formData;
  const idx = dataSource.findIndex((item: any) => item.id === formData.id);
  if (values.is_controller === false) {
    values = null;
  } else {
    delete values.is_controller;
  }
  dataSource[idx]['controller_data'] = values;
  setDataSource([...dataSource]);
  stepFormState.setOpen(false);
};
