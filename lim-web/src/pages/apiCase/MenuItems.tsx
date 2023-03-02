import {
  API,
  API_CASE,
  API_FOREACH,
  API_FUNC,
  API_HEADER,
  API_HOST,
  API_SQL,
  API_VAR,
  PATCH,
  POST,
  STEP_TYPE_LABEL,
} from '@/utils/constant';
import { showStepForm } from './func';
export const menuItems = (stepFormState: any, rowIndex: number = -1) => [
  //添加步骤按钮菜单
  {
    key: '1',
    label: '执行步骤',
    children: [API, API_SQL, API_FOREACH, API_CASE].map((item) => {
      return {
        key: item,
        label: (
          <a onClick={() => showStepForm(stepFormState, { formType: POST, type: item, rowIndex: rowIndex })}>
            {STEP_TYPE_LABEL[item]}
          </a>
        ),
      };
    }),
  },
  {
    key: '2',
    label: '配置元件',
    children: [API_VAR, API_HEADER, API_HOST].map((item) => {
      return {
        key: item,
        label: (
          <a onClick={() => showStepForm(stepFormState, { formType: POST, type: item, rowIndex: rowIndex })}>
            {STEP_TYPE_LABEL[item]}
          </a>
        ),
      };
    }),
  },
];
