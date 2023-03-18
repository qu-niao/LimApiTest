//export const HOST_SERVER = 'http://127.0.0.1:8006';
export const HOST_SERVER = 'http://121.43.43.59:8006';
export const VERSION='1.1'
export const GET = 'get'; //代表请求列表
export const DELETE = 'delete'; //代表删除数据
export const POST = 'post'; //代表创建数据
export const PATCH = 'patch'; //代表修改数据
export const DIY_CFG = 1;
export const PRO_CFG = 2;
export const TABLE_MODE = 1; //用例填写参数时的方式，列表格式
export const JSON_MODE = 2; //用例填写参数时的方式，Json格式
export const TEXT_MODE = 3; //用例填写参数时的方式，文本格式
export const FORM_MODE = 4; //用例填写参数时的方式，表单格式
export const CODE_MODE = 5; //用例填写参数时的方式，代码格式
export const FORM_FILE_TYPE = 1;
export const FORM_TEXT_TYPE = 2;
export const API_PARAM_TEXT = {
  header: 'Header(请求头)',
  query: 'Query(url参数)',
  body: 'Body(请求体)',
  expect: '预期结果',
  output: '输出变量',
  response: '响应结果',
  res_header: '响应头',
  output_data: '输出变量',
};

export const REQ_METHOD_OPTIONS = [
  {
    value: 'GET',
    label: 'GET',
  },
  {
    value: 'POST',
    label: 'POST',
  },
  {
    value: 'PUT',
    label: 'PUT',
  },
  {
    value: 'DELETE',
    label: 'DELETE',
  },
  {
    value: 'PATCH',
    label: 'PATCH',
  },
];
export const PARAM_TYPE_LABEL = [
  {
    value: 'str',
    label: '字符串',
  },
  {
    value: 'POST',
    label: '数字',
  },
  {
    value: 'PUT',
    label: '对象',
  },
  {
    value: 'DELETE',
    label: 'DELETE',
  },
  {
    value: 'PATCH',
    label: 'PATCH',
  },
];
export const DIY_FUNC_RES_TIPS = "response=响应结果，response['code']等于取响应结果中code字段的值；";
export const DIY_FUNC_VAR_TIPS = "var=全局变量，var['name']等于取变量名为name的值；";
//---文字文本-----
export const DELETE_CONFIRM_TIP = '您确定要删除吗？';

//---
export const API_HEADER = 'header';
export const API_HOST = 'host';
export const API_VAR = 'var';
export const API_FOREACH = 'foreach';
export const API = 'api';
export const API_CASE = 'case';
export const API_SQL = 'sql';
export const API_FUNC = 'api_func';
//---
//--color--
export const SUCCESS_COLOR = '#30BF78'; //执行通过的颜色
export const FAILED_COLOR = '#F4664A'; //执行失败的颜色
export const SKIP_COLOR = '#1890FF'; //执行被跳过的颜色
export const STATUS_2_COLOR = '#FF8C00';
export const DISABLED_COLOR = '#BEBEBE';
export const PINK_COLOR = '#DA70D6';
export const STEP_TYPE_LABEL = {
  header: '全局请求头',
  host: '全局请求地址',
  var: '全局变量',
  foreach: '循环控制器',
  api: '接口',
  case: '引用测试用例',
  sql: 'SQL语句',
  api_func: '自定义函数',
};
export const REQ_METHOD_LABEL = {
  GET: { text: 'GET', status: '#2DB7F5' },
  POST: { text: 'POST', status: PINK_COLOR },
  PUT: { text: 'PUT', status: SUCCESS_COLOR },
  DELETE: { text: 'DELETE', status: FAILED_COLOR },
  PATCH: { text: 'PATCH', status: '#657798' },
  NONE: { text: 'NONE', status: '' },
};
//----status
export const WAITING_STATUS = 0;
export const FAILED_STATUS = 1;
export const RUNNING_STATUS = 2;
export const FINISH_STATUS = 3;
export const SUCCESS_STATUS = 4;
export const INTERRUPT_STATUS = 6;
export const DISABLED_STATUS = 7;
export const FAILED_STOP_STATUS = 8;
export const STATUS_LABEL = {
  0: { text: '等待执行', status: '' },
  1: { text: '执行失败', status: FAILED_COLOR },
  2: { text: '正在执行', status: STATUS_2_COLOR },
  3: { text: '执行完成', status: '#1890FF' },
  4: { text: '执行通过', status: SUCCESS_COLOR },
  5: { text: '跳过执行', status: SKIP_COLOR },
  6: { text: '中断执行', status: PINK_COLOR },
  7: { text: '禁止执行', status: DISABLED_COLOR },
  8: { text: '失败中断', status: FAILED_COLOR },
};
//---parms---
export const VAR_PARAM = '3';
export const HEADER_PARAM = '2';
export const HOST_PARAM = '1';
export const TEMP_PARAMS_LABEL = {
  1: '全局请求地址',
  2: '全局请求头',
  3: '全局变量',
};
export const STRING = 'string';
export const OBJECT = 'object';
export const BOOL = 'boolean';
export const NUMBER = 'number';
//
export const MYSQL = 'mysql';
export const REDIS = 'rds';
//期望判断枚举
export const EQUAL = 1; //相等
export const NOT_EQUAL = 2; //不相等
export const CONTAIN = 3; //包含
export const NOT_CONTAIN = 4; //不包含
export const HAVE_KEY = 5; //存在key
export const EXPECT_RULE_LABEL = [
  { id: EQUAL, name: '等于' },
  { id: NOT_EQUAL, name: '不等于' },
  { id: CONTAIN, name: '包含' },
  { id: NOT_CONTAIN, name: '不包含' },
  { id: HAVE_KEY, name: '字段存在即可' },
];
export const REPORT_STEP_STATUS_COLOR = {
  '成功': SUCCESS_COLOR,
  '失败': FAILED_COLOR,
  '跳过': SKIP_COLOR, 
  '禁用': DISABLED_COLOR,
};