import React, { useState, useRef, useImperativeHandle, useContext } from 'react';
import { unstable_batchedUpdates } from 'react-dom'; //批量更新状态时使用
import { Modal, Button, message, Drawer, Tooltip, AutoComplete, Tabs, Tag, Input, Collapse } from 'antd';
import {
  ProFormText,
  ProFormTextArea,
  ProFormCascader,
  ProFormItem,
  ProFormDigit,
  ProFormRadio,
  ProFormGroup,
  ProFormSelect,
  EditableProTable,
} from '@ant-design/pro-components';
import {
  API,
  API_CASE,
  API_PARAM_TEXT,
  API_FOREACH,
  API_FUNC,
  API_HEADER,
  API_HOST,
  API_SQL,
  API_VAR,
  DIY_CFG,
  POST,
  PRO_CFG,
  REQ_METHOD_OPTIONS,
  STEP_TYPE_LABEL,
  TABLE_MODE,
  GET,
  REQ_METHOD_LABEL,
} from '@/utils/constant';
import apiDataContext from './context';
import { ExclamationCircleTwoTone, QuestionCircleOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import './index.css';
import { LimDrawerForm } from '@/components/limDrawerForm';
import { apiDataView, searchApi, testApiData } from '@/services/apiData';
import { DiyFormText } from '@/components/diyAntdPomponent';
import { ParamsNodes } from '@/components/paramsNodes/paramsNodes';
import JsonView from '@/components/jsonView';
import { onDoubleClick } from '@/utils/utils';
import { parseCascaderJson } from '@/components/paramsNodes/func';
import ApiRelationCases from '../apiRelationCases';
const { TabPane } = Tabs;
const { Panel } = Collapse;
const onDoubleClickFn = onDoubleClick();
export const ApiContentForm = ({ childRef, defaultParams, setDefaultParams, formData, formRef }: any) => {
  console.log('form', formData);
  const editorFormRefs = {
    header: useRef(),
    query: useRef(),
    body: useRef(),
    expect: useRef(),
    output: useRef(),
  };
  const { paramTypeCand, projectCand } = useContext(apiDataContext);
  const params = formData?.params || {};
  const [sendButLoading, setSendButLoading] = useState<boolean>(false);
  const [searchApiData, setSearchApiData] = useState<any>([]);
  const [hostType, setHostType] = useState<number>(params.host_type || DIY_CFG);
  const [curApiId, setCurApiId] = useState<number>(formData.api_id || 0);
  const [reqLog, setReqLog] = useState<any>(formData?.results?.request_log || {});
  const [currentTabs, setCurrentTabs] = useState<string>('header');
  const [relationOpen, setrelationOpen] = useState<boolean>(false);
  const [paramEditableKeys, setParamEditableKeys] = useState<object>(() => {
    let _json = {};
    ['header', 'query', 'body', 'expect', 'output'].forEach((type) => {
      _json[`${type}_source`] = Array.isArray(params[`${type}_source`])
        ? params[`${type}_source`]?.map((item: any) => item.id) || []
        : [];
    });
    return _json;
  });
  const [paramMode, setParamMode] = useState({
    header_mode: params['header_mode'] || TABLE_MODE,
    query_mode: params['query_mode'] || TABLE_MODE,
    body_mode: params['body_mode'] || TABLE_MODE,
    expect_mode: params['expect_mode'] || TABLE_MODE,
    output_mode: params['output_mode'] || TABLE_MODE,
  });
  const [parmsType, setParmsType] = useState<any>({}); //antdpro官方有BUG，不得不这样做2023年1月27日 00:28:12
  const renderNetWorkPanes = (type: string) => {
    let returnNodes: any = '';
    let srcItem = reqLog[type];
    if (srcItem) {
      if (typeof srcItem === 'object') {
        //数据为json的情况
        returnNodes = (
          <JsonView
            onSelect={(value: any) =>
              onDoubleClickFn({
                doubleClick: (e: any) => {
                  if (paramMode[currentTabs + '_mode'] === TABLE_MODE) {
                    let fieldName = '';
                    value['namespace'].forEach((item: any) => {
                      if (isNaN(item)) {
                        //判断item是否不是 数字
                        fieldName += '.' + item;
                      } else {
                        fieldName += `[${item}]`;
                      }
                    });
                    fieldName += '.' + value['name'];
                    fieldName = fieldName.slice(1);
                    const sourceName = `${currentTabs}_source`;
                    let data = formRef.current.getFieldValue(sourceName) || [];
                    const rowId = Date.now();
                    let pushData: any = {
                      id: rowId,
                      name: fieldName,
                      type: {
                        auto: true,
                        type: ['query', 'header'].includes(currentTabs) ? 'string' : typeof value['value'],
                      },
                      value: parseCascaderJson(value['value']),
                    };
                    if (currentTabs === 'output') {
                      pushData['name'] = value['name'];
                      pushData['value'] = fieldName;
                      delete pushData.type;
                    }
                    data.push(pushData);
                    let json = {};
                    json[sourceName] = data;
                    paramEditableKeys[currentTabs + '_source'].push(rowId);
                    setParamEditableKeys({ ...paramEditableKeys });
                    formRef.current.setFieldsValue(json);
                  } else {
                    message.warning('只有列表模式才支持自动填写！');
                  }
                },
              })
            }
            collapsed={1}
            src={srcItem}
          />
        );
      } else {
        //数据为字符串的请情况
        returnNodes = srcItem;
      }
    } else {
      //数据为null的情况
      returnNodes = '数据为空！';
    }
    return {
      label: <span style={{ fontWeight: 'bold' }}>{API_PARAM_TEXT[type]}</span>,
      key: type,
      children: returnNodes,
    };
  };
  const searchApiFunc = debounce(async (keywords) => {
    if (keywords) {
      return await searchApi({ search: keywords }).then((res) => {
        setSearchApiData(res.results);
        return res.results;
      });
    }
  }, 200);
  const loadApiData = async (apiId: any) => {
    if (apiId) {
      await apiDataView(GET, apiId).then((res: any) => {
        const formValue = formRef.current.getFieldsValue();
        const results = res.results;
        const apiParams = results?.params || {};
        delete results.params;
        apiParams.host_type = apiParams.host_type || DIY_CFG;
        //为了回填数据正常显示，要保证rowkeyid的唯一性
        let baseDateTime = Date.now(); //rowkey的id不能重复，不然会回填异常
        ['header', 'query', 'body', 'expect', 'output'].forEach((type) => {
          if (Array.isArray(apiParams[`${type}_source`])) {
            apiParams[`${type}_source`].forEach((item: any) => {
              item['id'] = baseDateTime;
              baseDateTime += 1;
            });
          }
        });
        unstable_batchedUpdates(() => {
          setParamEditableKeys(() => {
            let _json = {};
            ['header', 'query', 'body', 'expect', 'output'].forEach((type) => {
              _json[`${type}_source`] = Array.isArray(apiParams[`${type}_source`])
                ? apiParams[`${type}_source`]?.map((item: any) => item.id) || []
                : [];
            });
            return _json;
          });
          setCurApiId(results.api_id);
          setHostType(apiParams.host_type);
          const modeType = {
            header_mode: apiParams['header_mode'] || TABLE_MODE,
            query_mode: apiParams['query_mode'] || TABLE_MODE,
            body_mode: apiParams['body_mode'] || TABLE_MODE,
            expect_mode: apiParams['expect_mode'] || TABLE_MODE,
            output_mode: apiParams['output_mode'] || TABLE_MODE,
          };
          formRef.current.setFieldsValue({
            ...formValue,
            ...apiParams,
            ...results,
          });
          setParamMode(modeType);
        });
      });
    }
  };
  const sendReq = async () => {
    let values = formRef.current.getFieldsValue();
    console.log('sendReq', values);
    if (values) {
      if (!values.path) {
        message.error('接口地址不能为空！');
        return;
      }
    } else {
      message.error('参数不符合要求！');
      return;
    }
    values = parseSaveSource(values, parmsType);
    setSendButLoading(true);
    await testApiData({
      params: values,
      step_name: formData.step_name,
    }).then(
      (res) => {
        message.success('请求成功！');
        setReqLog(res.results.request_log);
        setSendButLoading(false);
        // defaultUserParamsAll({}, REQ_LIST).then((paramRes) => {
        //   if (setDefaultParams) {
        //     setDefaultParams(paramRes.data);
        //   }

        // });
      },
      () => setSendButLoading(false),
    );
  };
  const pathToQueryParams = (v: string) => {
    if (v.includes('?')) {
      const pathData = v.split('?');
      const realPath = pathData[0]; //去除参数后的真正的接口地址
      const paraseParams = pathData.slice(-1)[0]; //参数地址
      const params = paraseParams.split('&');
      let querySource = [];
      let queryEditKeys = [];
      let rowKey = Date.now();
      for (var i = 0; i < params.length; i++) {
        const [name, value] = params[i].split('=');
        const index = rowKey + i;
        queryEditKeys.push(index);
        querySource.push({
          id: index,
          name: name,
          value: value,
          type: { auto: false, type: 'string' },
        });
      }
      const editKeys = { ...paramEditableKeys };
      editKeys['query_source'] = queryEditKeys;
      setParamMode({ ...paramMode });
      paramMode['query_mode'] = TABLE_MODE;
      Modal.warning({
        title: '提示',
        content: '接口地址包含参数，已自动转化到Query参数中。',
      });
      formRef.current.setFieldsValue({
        path: realPath,
        query_source: querySource,
      });
      setParamEditableKeys(editKeys);
    }
  };
  useImperativeHandle(childRef, () => ({
    parmsType: parmsType,
  }));
  return (
    <>
      <ProFormGroup>
        <DiyFormText
          rules={[
            { required: true, message: '接口名称必填' },
            { type: 'string' },
            { max: 36, message: '最多36个字' },
          ]}
          label={<span> 接口名称 </span>}
          placeholder="请输入接口名称"
        />
        <ProFormSelect
          name="project_id"
          width={350}
          label="选择接口所属项目"
          rules={[
            {
              required: true,
              message: '选择接口所属项目！',
            },
          ]}
          fieldProps={{
            showSearch: true,
            allowClear: false,
            options: projectCand || [],
            fieldNames: {
              label: 'name',
              value: 'id',
            },
          }}
        />
        <ProFormSelect
          width={90}
          allowClear={false}
          options={REQ_METHOD_OPTIONS}
          name="method"
          label="请求方法"
        />
        <ProFormDigit
          width={100}
          placeholder="60"
          label="请求超时时间(默认60)"
          name="timeout"
          min={1}
          max={600}
          fieldProps={{ addonAfter: '秒' }}
        />
        <a
          key="report"
          style={{ top: 35, position: 'relative', fontWeight: 'bold' }}
          onClick={() => setrelationOpen(true)}
          target="_blank"
        >
          查看使用了该接口的用例
        </a>
      </ProFormGroup>
      <ProFormGroup>
        <Input.Group compact>
          {hostType === DIY_CFG ? (
            <ProFormText
              width={180}
              name="host"
              allowClear={false}
              rules={[{ type: 'string' }, { max: 200, message: '最多200个字' }]}
              label={
                <Tooltip
                  overlayStyle={{ maxWidth: 600 }}
                  placement="right"
                  title="在执行一次任务后，会默认使用上次任务配置的全局请求地址；否则始终使用填写的数据！
              （因此，建议此项不填，而是配置全局请求地址）"
                >
                  {STEP_TYPE_LABEL[API_HOST]}
                  <ExclamationCircleTwoTone twoToneColor="#FAAD14" style={{ marginLeft: 3 }} />
                </Tooltip>
              }
              placeholder={`请输入${STEP_TYPE_LABEL[API_HOST]}`}
            />
          ) : (
            <ProFormSelect
              width={180}
              name="host"
              placeholder="请选择项目请求地址"
              label={
                <Tooltip
                  overlayStyle={{ maxWidth: 600 }}
                  placement="right"
                  title={`仅显示配置了${STEP_TYPE_LABEL[API_HOST]}的项目`}
                >
                  选择项目
                  <ExclamationCircleTwoTone
                    twoToneColor="#FAAD14"
                    style={{ marginLeft: 3, marginRight: 8 }}
                  />
                  <a onClick={() => window.open(`/project`)}>维护项目地址</a>
                </Tooltip>
              }
              fieldProps={{
                fieldNames: {
                  label: 'name',
                  value: 'id',
                  options: 'disabled',
                },
              }}
              allowClear
              options={projectCand}
            />
          )}
          <ProFormRadio.Group
            name="host_type"
            label=" "
            radioType="button"
            fieldProps={{
              onChange: (e) => {
                setHostType(e.target.value);
                formRef.current.setFieldsValue({ host: null });
              },
              options: [
                {
                  label: `自定义`,
                  value: DIY_CFG,
                },
                {
                  label: `按项目`,
                  value: PRO_CFG,
                },
              ],
            }}
          />
        </Input.Group>
        <ProFormItem
          label="接口地址"
          rules={[
            { required: true, message: '接口地址必填!' },
            { type: 'string' },
            { max: 255, message: '最多255个字' },
          ]}
          name="path"
        >
          <AutoComplete
            // disabled={
            //   apiType === SWAGGER_API && editStatus !== ABANDONED_API && !isPlan
            //     ? true
            //     : false
            // }
            style={{ width: 500 }}
            placeholder="请输入接口地址或接口名称"
            onSelect={(...data: any) => loadApiData(data[1].api_id)}
            onChange={(v) => searchApiFunc(v)}
            onBlur={(e: any) => pathToQueryParams(e.target.value)}
            options={searchApiData}
          />
        </ProFormItem>
        <Button type="primary" style={{ top: 30.5 }} onClick={() => sendReq()} loading={sendButLoading}>
          发送请求
        </Button>
        <a
          style={{ fontWeight: 'bold', top: 35, position: 'relative' }}
          target="_blank"
          href="https://shanshu-tech.yuque.com/gl3u7s/lqgrg9/uzykgi#ZEQS2"
        >
          变量使用说明文档
          <QuestionCircleOutlined style={{ marginLeft: 3 }} />
        </a>
      </ProFormGroup>
      <Tabs
        tabBarGutter={0}
        type="card"
        defaultActiveKey="header"
        onChange={(e) => {
          setCurrentTabs(e);
        }}
      >
        {['header', 'query', 'body', 'expect', 'output'].map((type) => {
          return (
            <TabPane
              forceRender={true}
              tab={
                type === 'header' ? (
                  <Tooltip
                    overlayStyle={{ maxWidth: 600 }}
                    placement="right"
                    title="该项填写会覆盖公共请求头的设置，所以填写后需重新设置令牌"
                  >
                    <span style={{ fontWeight: 'bold' }}>{API_PARAM_TEXT[type]}</span>
                    <ExclamationCircleTwoTone twoToneColor="#FAAD14" style={{ marginLeft: 3 }} />
                  </Tooltip>
                ) : (
                  <span style={{ fontWeight: 'bold' }}>{API_PARAM_TEXT[type]}</span>
                )
              }
              key={type}
            >
              <ParamsNodes
                formRef={formRef}
                type={type}
                parmsType={parmsType}
                setParmsType={setParmsType}
                paramMode={paramMode}
                setParamMode={setParamMode}
                paramEditableKeys={paramEditableKeys}
                setParamEditableKeys={setParamEditableKeys}
                editorFormRefs={editorFormRefs}
                paramTypeCand={paramTypeCand}
              />
            </TabPane>
          );
        })}
      </Tabs>
      {Object.keys(reqLog).length ? (
        <Collapse defaultActiveKey={['1']} style={{ marginTop: -20 }}>
          <Panel
            forceRender={true}
            header={
              <span style={{ fontWeight: 'bold' }}>
                请求日志【双击下方结果中任意字段值，可将其添加至参数列表中】
                {reqLog.spend_time ? (
                  <Tag style={{ marginLeft: 6 }} color="geekblue">
                    耗时：{reqLog.spend_time}s
                  </Tag>
                ) : null}
              </span>
            }
            key="1"
          >
            <div>
              <Tooltip overlayStyle={{ maxWidth: 1000 }} title={reqLog.url}>
                <span style={{ fontWeight: 'bold' }}>{'请求信息：' + reqLog.url}</span>
                {reqLog.method ? (
                  <Tag style={{ marginLeft: 8, minWidth: 40 }} color={REQ_METHOD_LABEL[reqLog.method].status}>
                    {REQ_METHOD_LABEL[reqLog.method].text}
                  </Tag>
                ) : null}
              </Tooltip>
              {reqLog.results && <pre style={{ color: 'red', marginTop: 30 }}>{reqLog.results}</pre>}
              <Tabs
                style={{ marginTop: 16 }}
                tabBarGutter={0}
                type="card"
                defaultActiveKey="1"
                items={['header', 'body', 'response', 'res_header', 'output'].map((item) =>
                  renderNetWorkPanes(item),
                )}
              />
            </div>
          </Panel>
        </Collapse>
      ) : null}
      <Drawer
        title="使用了该接口的用例列表"
        placement="right"
        width={1200}
        zIndex={102}
        destroyOnClose={true}
        onClose={() => setrelationOpen(false)}
        open={relationOpen}
      >
        <ApiRelationCases apiId={curApiId} />
      </Drawer>
    </>
  );
};
export const getApiInitValues = (formData: any) => {
  const params = formData.params || {};
  let _value = {
    name: formData.name || null,
    method: formData.method || 'GET',
    project_id: formData.project_id || null,
    timeout: formData.timeout || null,
    path: formData.path || null,
    host: params.host || null,
    host_type: params.host_type || DIY_CFG,
  };
  ['header', 'query', 'body', 'expect', 'output'].forEach((type) => {
    _value[`${type}_mode`] = params[`${type}_mode`] || TABLE_MODE;
    _value[`${type}_source`] = params[`${type}_source`] || [];
  });
  return _value;
};
//antd官方BUG，不得不这样写来解决
export const parseSaveSource = (params: any, parmsType: any) => {
  for (let type in parmsType) {
    if (params[`${type}_mode`] == TABLE_MODE) {
      for (let index in parmsType[type]) {
        params[type + '_source'][index]['type'] = parmsType[type][index];
      }
    }
  }
  return params;
};
const Form: React.FC<any> = ({ formData, ...props }) => {
  const formRef = useRef();
  return (
    <LimDrawerForm
      formRef={formRef}
      width={1260}
      title={formData.formType === POST ? '创建接口' : '修改接口'}
      initialValues={getApiInitValues(formData)}
      {...props}
      formItems={<ApiContentForm formRef={formRef} formData={formData} />}
    />
  );
};
export default React.memo<any>(Form);
