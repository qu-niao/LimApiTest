import { useRef, useImperativeHandle, useEffect, useContext, useState } from 'react';
import {
  Tooltip,
  Dropdown,
  Tabs,
  Collapse,
  Tag,
  Button,
  message,
  Table,
  Spin,
  Divider,
  Typography,
  Popover,
} from 'antd';
import {
  ProFormText,
  ProFormSelect,
  ProFormItem,
  EditableProTable,
  ProFormRadio,
  ProFormCascader,
  ProFormTextArea,
  ProFormGroup,
} from '@ant-design/pro-components';
import { ExclamationCircleTwoTone } from '@ant-design/icons';
import {
  API_HEADER,
  API_HOST,
  DIY_CFG,
  PRO_CFG,
  STEP_TYPE_LABEL,
  TABLE_MODE,
  JSON_MODE,
  CODE_MODE,
  MYSQL,
  REDIS,
  SUCCESS_COLOR,
  GET,
  FAILED_STATUS,
  FAILED_COLOR,
  CODE_VAR_EXP,
  CODE_VAR_TIPS,
} from '@/utils/constant';
import apiDataContext from '@/pages/apiData/context';
import { paramsColumns } from '@/components/paramsNodes/columns';
import { ParamsNodes } from '@/components/paramsNodes/paramsNodes';
import { getProjDbDatabase, runSql } from '@/services/project';
import DragSortTable from '@/pages/apiCase/dragSortTable';
import { stepColumns } from './columns';
import { ControllerForm, StepForm } from './stepForm';
import { caseView } from '@/services/apiData';
import { menuItems } from './MenuItems';
import { CodeEditNode } from '@/components/codeEdit';
const { Paragraph } = Typography;
const { TabPane } = Tabs;
const { Panel } = Collapse;
export const HostForm = ({ formRef, formData }: any) => {
  const [hostType, setHostType] = useState<any>(formData.params?.host_type || DIY_CFG);
  const STEP_LABEL = STEP_TYPE_LABEL[API_HOST];
  return (
    <>
      <ProFormRadio.Group
        name="host_type"
        fieldProps={{
          onChange: (e) => {
            setHostType(e.target.value);
            formRef.current.setFieldsValue({ value: null });
          },
          options: [
            {
              label: `自定义${STEP_LABEL}`,
              value: DIY_CFG,
            },
            {
              label: `选择项目配置的${STEP_LABEL}`,
              value: PRO_CFG,
            },
          ],
        }}
      />
      {hostType === DIY_CFG ? (
        <ProFormText
          width="sm"
          name="value"
          allowClear={false}
          rules={[
            { required: true, message: `${STEP_LABEL}必填！` },
            { type: 'string' },
            { max: 200, message: '最多200个字' },
          ]}
          label={STEP_LABEL}
          placeholder={`请输入${STEP_LABEL}`}
        />
      ) : (
        <div style={{ display: 'flex' }}>
          <ProFormSelect
            width={180}
            name="value"
            label={
              <Tooltip
                overlayStyle={{ maxWidth: 600 }}
                placement="right"
                title={`仅显示配置了${STEP_LABEL}的项目`}
              >
                选择项目
                <ExclamationCircleTwoTone twoToneColor="#FAAD14" style={{ marginLeft: 3 }} />
              </Tooltip>
            }
            fieldProps={{
              fieldNames: { label: 'name', value: 'id' },
            }}
            rules={[{ required: true, message: '请求地址必填' }]}
            allowClear={false}
            options={formData.projectEnvirCand || []}
          />
        </div>
      )}
    </>
  );
};
export const HeaderForm = ({ formData }: any) => {
  const editorFormRef = useRef<any>();
  const { paramTypeCand, projectCand } = useContext(apiDataContext);
  const [editableKeys, setEditableKeys] = useState<any>(
    () => formData.params?.map((item: any) => item.id) || [],
  );
  return (
    <ProFormItem name="value" trigger="onValuesChange">
      <EditableProTable
        editableFormRef={editorFormRef}
        bordered
        rowKey="id"
        toolBarRender={false}
        columns={paramsColumns(API_HEADER, paramTypeCand, editorFormRef)}
        recordCreatorProps={{
          newRecordType: 'dataSource',
          position: 'bottom',
          record: () => ({
            id: Date.now(),
          }),
        }}
        editable={{
          type: 'multiple',
          editableKeys: editableKeys,
          onChange: setEditableKeys,
          actionRender: (row, _, dom) => {
            return [dom.delete];
          },
        }}
      />
    </ProFormItem>
  );
};
export const VarForm = ({ formData, formRef, childRef }: any) => {
  const fValue = formData.params || {};
  let editData = {};
  let paramModeData = {};
  for (let key in fValue) {
    if (key.includes('_source')) {
      editData[key] = Array.isArray(fValue[key]) ? fValue[key]?.map((item: any) => item.id) : [];
    } else {
      paramModeData[key] = fValue[key];
    }
  }
  const editorFormRefs = {};
  formData.envirData.forEach((item: any) => (editorFormRefs[item.id] = useRef()));
  const [editableKeys, setEditableKeys] = useState<any>(editData);
  const [paramMode, setParamMode] = useState(paramModeData);
  const { paramTypeCand } = useContext(apiDataContext);
  const [parmsType, setParmsType] = useState<any>({}); //antdpro官方有BUG，不得不这样做2023年1月27日 00:28:12
  useImperativeHandle(childRef, () => ({
    parmsType: parmsType,
  }));
  const renderImportMenu = (envir: any) => {
    let resData: any[] = [];
    formData.envirData.forEach((item: any) => {
      if (envir.id !== item.id) {
        resData.push({
          label: (
            <span
              onClick={() => {
                const data = formRef.current.getFieldsValue();
                const newModeKey = `${envir.id}_mode`;
                const newSourceKey = `${envir.id}_source`;
                const newData = {
                  [`${newModeKey}`]: data[`${item.id}_mode`],
                  [`${newSourceKey}`]: data[`${item.id}_source`],
                };
                if (newData[newModeKey] === TABLE_MODE) {
                  let source: any = [];
                  editableKeys[newSourceKey] = [];
                  paramMode[newModeKey] = TABLE_MODE;
                  const idx = Date.now();
                  newData[newSourceKey].forEach((item: any, index: number) => {
                    source.push({ ...item, ...{ id: idx + index } });
                    editableKeys[newSourceKey].push(idx + index);
                  });
                  newData[newSourceKey] = source;
                  setEditableKeys({ ...editableKeys });
                } else {
                  paramMode[newModeKey] = newData[newModeKey];
                }
                formRef.current.setFieldsValue(newData);
                console.log('dd', paramMode, newData);
                setParamMode({ ...paramMode });
              }}
            >
              {item.name}
            </span>
          ),
          key: item.key,
        });
      }
    });
    return resData;
  };
  const renderPanes = (envir: any) => {
    return {
      forceRender: true,
      label: <span style={{ fontWeight: 'bold' }}>{envir.name}</span>,
      // label: (
      //   <Dropdown
      //     menu={{
      //       items: [
      //         {
      //           label: '导入变量',
      //           key: 'insert',
      //           children: renderImportMenu(envir),
      //         }, // 菜单项务必填写 key
      //       ],
      //     }}
      //     trigger={['contextMenu']}
      //   >
      //     <span style={{ fontWeight: 'bold' }}>{envir.name}</span>
      //   </Dropdown>
      // ),
      key: envir.id,
      children: (
        <ParamsNodes
          formRef={formRef}
          type={envir.id}
          paramMode={paramMode}
          setParamMode={setParamMode}
          paramEditableKeys={editableKeys}
          setParamEditableKeys={setEditableKeys}
          editorFormRefs={editorFormRefs}
          paramTypeCand={paramTypeCand}
          parmsType={parmsType}
          setParmsType={setParmsType}
          modeOptions={[
            {
              label: '列表模式',
              value: TABLE_MODE,
            },
            {
              label: 'Json模式',
              value: JSON_MODE,
            },
            {
              label: (
                <Tooltip placement="top" title={CODE_VAR_TIPS} overlayStyle={{ maxWidth: 600 }}>
                  <span style={{ fontSize: 14 }}>代码模式</span>
                  <ExclamationCircleTwoTone twoToneColor="#FAAD14" style={{ marginLeft: 3 }} />
                </Tooltip>
              ),
              value: CODE_MODE,
            },
          ]}
        />
      ),
    };
  };
  return (
    <Tabs
      tabBarGutter={0}
      type="card"
      defaultActiveKey="1"
      items={formData.envirData.map((item: any) => renderPanes(item))}
    />
  );
};
export const SqlForm = ({ formRef, formData }: any) => {
  const [dbType, setDbType] = useState<any>(formData?.db_type || MYSQL);
  const [databaseCand, setDatabaseCand] = useState<any>([]);
  const [databaseLoading, setDatabaseLoading] = useState<boolean>(false);
  const [sqlLoading, setSqlLoading] = useState<boolean>(false);
  const [executeSql, setExecuteSql] = useState<any>('');
  const [columns, setColumns] = useState<any>([]); //传递给弹窗显示的数据
  const [data, setData] = useState<any>([]); //传递给弹窗显示的数据
  const reqProjDbDatabase = (params: object) => {
    setDatabaseLoading(true);
    getProjDbDatabase(params)
      .then((res) => {
        setDatabaseCand(res.results);
      })
      .finally(() => setDatabaseLoading(false));
  };
  useEffect(() => {
    if (formData.params?.sql_proj_related?.length) {
      reqProjDbDatabase({ db: formData.params.sql_proj_related });
    }
  }, []);
  const sendSql = () => {
    const sqlData = formRef.current.getFieldsValue();
    if (!sqlData.sql || !sqlData.sql_proj_related.length) {
      message.error('请完善必填项！');
      return;
    }
    setSqlLoading(true);
    runSql(sqlData)
      .then(
        (res) => {
          const resData = res?.results || {};
          setExecuteSql(resData.sql);
          if (dbType === MYSQL) {
            const column =
              resData.columns?.map((item: any) => {
                item['render'] = (v: any, _: any) => {
                  return <Paragraph ellipsis={{ expandable: true }}>{v}</Paragraph>;
                };
                return item;
              }) || [];
            setColumns(column);
            setData(resData.sql_data || []);
          }
        },
        (res) => {
          const resData = res.results;
          if (resData) {
            setExecuteSql(resData.sql);
            setColumns([]);
            setData([]);
          }
        },
      )
      .finally(() => setSqlLoading(false));
  };
  return (
    <>
      <ProFormGroup>
        <ProFormRadio.Group
          name="db_type"
          radioType="button"
          label="数据库类型"
          rules={[
            {
              required: true,
              message: '该项必填！',
            },
          ]}
          fieldProps={{
            onChange: (e) => {
              setDbType(e.target.value);
            },
            options: [
              {
                label: 'MySql',
                value: MYSQL,
              },
              {
                label: 'Redis',
                value: REDIS,
                disabled: true,
              },
            ],
          }}
        />
        <ProFormText
          width={160}
          name="sql_var"
          allowClear={false}
          fieldProps={
            {
              // onFocus: (e: any) => {
              //   initValue = e.target.value;
              // },
            }
          }
          rules={[
            {
              required: false,
              message: '变量名必填',
            },

            { type: 'string' },
          ]}
          label="输出变量名"
          placeholder="请输入"
        />
      </ProFormGroup>
      <ProFormGroup>
        <ProFormCascader
          name="sql_proj_related"
          width="md"
          label={
            <Tooltip
              overlayStyle={{ maxWidth: 600 }}
              placement="right"
              title="列表数据为id=1的环境下配置的数据库连接名称，若要在其他环境执行该任务，需其他环境下有同名连接名称！"
            >
              选择数据库连接
              <ExclamationCircleTwoTone twoToneColor="#FAAD14" style={{ marginLeft: 3 }} />
            </Tooltip>
          }
          allowClear={false}
          rules={[{ required: true, message: '项目数据库连接必选！' }]}
          fieldProps={{
            options: formData.projectEnvirCand || [],
            fieldNames: {
              label: 'name',
              children: 'children',
              value: 'id',
            },
            onChange: (v: any) => {
              setDatabaseCand([]);
              reqProjDbDatabase({ db: v });
            },
          }}
        />
        {databaseCand.length ? (
          <ProFormSelect
            width={180}
            name="database"
            label="选择数据库"
            fieldProps={{
              fieldNames: {
                label: 'name',
                value: 'id',
              },
            }}
            options={databaseCand}
          />
        ) : (
          <Spin spinning={databaseLoading} style={{ marginTop: 36 }} />
        )}
      </ProFormGroup>
      <ProFormGroup>
        <ProFormTextArea
          name="sql"
          width={800}
          label="SQL语句"
          rules={[{ type: 'string' }, { required: true }]}
          placeholder="请输入SQL"
          fieldProps={{
            autoSize: { minRows: 2 },
          }}
        />
        <Button type="primary" style={{ top: 50 }} onClick={() => sendSql()} loading={sqlLoading}>
          执行SQL
        </Button>
      </ProFormGroup>
      {executeSql && <p style={{ color: SUCCESS_COLOR }}>实际执行SQL：{executeSql}</p>}
      <h3 style={{ fontWeight: 'bold' }}>
        查询结果【整数值过大时可能与实际数据末尾数据不对，但实际处理中不影响使用】
      </h3>
      {dbType === MYSQL ? (
        <Table
          scroll={{ x: 800, y: 400 }}
          bordered
          rowKey="id"
          columns={columns}
          dataSource={data}
          size="small"
          pagination={{ showSizeChanger: true }}
        />
      ) : (
        <>{typeof data === 'string' ? data : null}</>
      )}
    </>
  );
};

export const CaseStepForm = ({ childRef, formRef, formData }: any) => {
  const { treeCascaderCase } = useContext(apiDataContext);
  const [stepOpen, setStepOpen] = useState<boolean>(false);
  const [stepFormData, setStepFormData] = useState<any>({}); //传递给弹窗显示的数据
  const [formWidth, setFormWidth] = useState<number>(1000);
  const [dataSource, setDataSource] = useState<any>([]);
  const tableState = { dataSource, setDataSource };
  const stepFormState = {
    open: stepOpen,
    setOpen: setStepOpen,
    formData: stepFormData,
    setFormData: setStepFormData,
    formWidth,
    setFormWidth,
  };
  useImperativeHandle(childRef, () => ({
    dataSource: dataSource,
  }));
  const reqCaseDetailData = (id: number, results = null) => {
    caseView(GET, { id }).then((res) => {
      //修改计划的级联展示字段值
      const resData = res.results;
      formRef.current.setFieldsValue({
        case_related: [...resData.module_related, ...[id]],
      });

      if (results) {
        if (typeof results === 'string') {
          message.error(results);
          setDataSource(resData.steps);
        } else {
          setDataSource(results);
          // if (latestRunTime < res.data.updated) {
          //   showPlanDataSourceConfirm(resData.steps, results);
          // } else {
          //   setDataSource(results);
          // }
        }
      } else {
        setDataSource(resData.steps);
      }
    });
  };
  useEffect(() => {
    if (formData.params?.case_related?.length) {
      reqCaseDetailData(formData.params?.case_related.slice(-1)[0], formData.results);
    }
  }, []);
  return (
    <>
      <ProFormCascader
        name="case_related"
        width="md"
        label="测试用例"
        rules={[
          {
            required: true,
            message: '请选择测试用例！',
          },
        ]}
        fieldProps={{
          showSearch: true,
          allowClear: false,
          onChange: (ids: any, reocrd: any) => {
            reqCaseDetailData(ids.slice(-1)[0]);
            formRef.current.setFieldsValue({
              step_name: reocrd.slice(-1)[0].name,
            });
          },
          options: treeCascaderCase,
          fieldNames: {
            label: 'name',
            value: 'id',
            children: 'children',
          },
        }}
      />
      <p style={{ color: '#e69138' }}>
        <ExclamationCircleTwoTone twoToneColor="#e69138" style={{ marginRight: 3 }} />
        因为用例是引用关系，所以修改下方步骤会直接修改原用例，请慎重修改！
      </p>
      <DragSortTable columns={stepColumns} tableState={tableState} stepFormState={stepFormState} />
      <StepForm stepFormState={stepFormState} tableState={tableState} />
    </>
  );
};

export const ForEachStepForm = ({ childRef, formRef, formData }: any) => {
  const [stepOpen, setStepOpen] = useState<boolean>(false);
  const [breakOpen, setBreakOpen] = useState<boolean>(false);
  const [stepFormData, setStepFormData] = useState<any>({}); //传递给弹窗显示的数据
  const [formWidth, setFormWidth] = useState<number>(1000);
  const [controllerFormData, setControllerFormData] = useState<any>({});
  const [controllerOpen, setControllerOpen] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<any>(formData.params?.steps || []);
  const tableState = { dataSource, setDataSource };
  const controllerFormState = {
    open: controllerOpen,
    setOpen: setControllerOpen,
    formData: controllerFormData,
    setFormData: setControllerFormData,
  };
  const stepFormState = {
    open: stepOpen,
    setOpen: setStepOpen,
    formData: stepFormData,
    setFormData: setStepFormData,
    formWidth,
    setFormWidth,
  };
  const items = menuItems(stepFormState);
  useImperativeHandle(childRef, () => ({
    dataSource: dataSource,
  }));

  const renderResultsNodes = () => {
    let renderNodes = [];
    const results = formData?.results;
    if (results && Array.isArray(results)) {
      for (let i = 0; i < results.length; i++) {
        const resTableState = { ...tableState };
        resTableState['dataSource'] = results[i];
        renderNodes.push(
          <TabPane
            tab={
              <>
                <span style={{ fontWeight: 'bold' }}>{`第${i + 1}次循环`}</span>
                {results[i]['status'] === FAILED_STATUS ? (
                  <Tag style={{ marginLeft: 8 }} color={FAILED_COLOR}>
                    失败
                  </Tag>
                ) : null}
              </>
            }
            key={i}
          >
            <DragSortTable
              columns={stepColumns}
              tableState={resTableState}
              stepFormState={stepFormState}
              controllerFormState={controllerFormState}
            />
          </TabPane>,
        );
      }
      return (
        <Collapse defaultActiveKey={['1']} style={{ marginTop: 20 }}>
          <Panel forceRender={true} header={<span style={{ fontWeight: 'bold' }}>执行结果</span>} key="1">
            <Tabs tabBarGutter={0} type="card" defaultActiveKey="response">
              {' '}
              {renderNodes}
            </Tabs>
          </Panel>
        </Collapse>
      );
    }
  };
  return (
    <>
      <ProFormGroup>
        <ProFormText
          width={180}
          allowClear={false}
          name="times"
          rules={[{ required: true, message: '该项必填！' }]}
          label="循环次数（可以是数字或变量，如果值为true则等于while循环）"
          placeholder="请输入"
        />
        <Popover
          overlayStyle={{ width: 600 }}
          content={
            <>
              <ProFormItem name="break_code">
                <CodeEditNode
                  initValue={
                    formData.params?.break_code ||
                    '# ' +
                      CODE_VAR_EXP +
                      "\n# 当return返回值为True的时候会执行该步骤，否则跳过执行：\nif var['name']=='项目':\n\treturn True"
                  }
                  onChangeFunc={(value: string) => {
                    formRef.current.setFieldsValue({ break_code: value });
                  }}
                />
              </ProFormItem>
              <Divider />
              <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                {' '}
                <Button type="primary" onClick={() => setBreakOpen(false)}>
                  确定
                </Button>
              </div>
            </>
          }
          title="编辑break(中止)条件"
          trigger="click"
          onOpenChange={(open: boolean) => setBreakOpen(open)}
          open={breakOpen}
        >
          <Button style={{ top: 30 }}>编辑Break(中止)条件</Button>
        </Popover>
      </ProFormGroup>
      <Dropdown menu={{ items }} trigger={['click']} placement="bottomLeft">
        <Button type="primary" style={{ float: 'right', bottom: 56, marginRight: 20 }}>
          添加步骤
        </Button>
      </Dropdown>
      <DragSortTable
        columns={stepColumns}
        tableState={tableState}
        stepFormState={stepFormState}
        controllerFormState={controllerFormState}
      />
      {renderResultsNodes()}
      <StepForm stepFormState={stepFormState} tableState={tableState} />
      <ControllerForm stepFormState={controllerFormState} tableState={tableState} />
    </>
  );
};
