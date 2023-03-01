import React, { useEffect, useCallback, useContext, useState } from 'react';
import { message, Table, Select, Button, Divider, Tooltip, notification, Checkbox } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { ExclamationCircleTwoTone } from '@ant-design/icons';
import apiDataContext from '@/pages/apiData/context';
import { clearUserTempParams, setUserCfg, userCfgParams } from '@/services/user';
import {
  BOOL,
  GET,
  HEADER_PARAM,
  HOST_PARAM,
  OBJECT,
  PATCH,
  POST,
  STRING,
  TEMP_PARAMS_LABEL,
  VAR_PARAM,
} from '@/utils/constant';
import JsonViewer from '@/components/jsonView';
import { CaseForm } from '@/pages/apiCase/form';
import { caseView, stopCasing, treeCaseModule } from '@/services/apiData';
import styles from '@/limLayout/index.css';
const columns = (showForm: Function) => [
  {
    title: '变量名',
    dataIndex: 'name',
    width: '20%',
    ellipsis: true,
  },
  {
    title: '值',
    dataIndex: 'value',
    width: '25%',
    ellipsis: true,
    render: (v: any, record: any) => {
      switch (record.param_type_id) {
        case STRING:
          return `"${v}"`;
        case BOOL:
          return `${v}`;
        case OBJECT:
          return <JsonViewer src={v} collapsed={0} />;
        default:
          return v;
      }
    },
  },
  {
    title: '类型',
    dataIndex: 'param_type_name',
    width: '25%',
    ellipsis: true,
  },
  {
    title: '来源（用例-步骤）',
    dataIndex: 'case_name',
    width: '30%',
    ellipsis: true,
    render: (case_name: string, record: any) => {
      if (record.case_id) {
        return (
          <Tooltip title={`${case_name}--${record.step_name}`} placement="leftTop">
            <span>
              <a onClick={() => window.open(`/apiCaseFormPage/?caseId=${record.case_id}`)}>{case_name}-- </a>
              {record.step_name}
            </span>
          </Tooltip>
        );
      }
      return <span>{'【调试产生】-- ' + record.step_name}</span>;
    },
  },
];

export const NotiUserParams: React.FC<any> = ({
  envirCand,
  layoutRef,
  paramTypeCand,
  projectCand,
  open,
  setOpen,
}: any) => {
  const [caseOpen, setCaseOpen] = useState<boolean>(false);
  const [caseFormData, setCaseFormData] = useState<any>({});
  const [treeCaseModuleData, setTreeCaseModuleData] = useState<any[]>([]);
  const setUserCfgFunc = (params: object) => {
    setUserCfg(params).then((res) => message.success(res.msg));
  };
  const renderParams = (params: any) => {
    let items = [];
    for (let key in params) {
      items.push(
        <div key={key}>
          <p style={{ fontWeight: 'bold', marginTop: 16 }}>{TEMP_PARAMS_LABEL[key]}</p>
          {[HEADER_PARAM, VAR_PARAM].includes(key) && params[key].length ? (
            <Table
              rowKey="id"
              dataSource={params[key]}
              size="small"
              columns={columns(showForm)}
              pagination={false}
              bordered
            />
          ) : key === HOST_PARAM && params[key].length ? (
            <p>
              {params[key][0].value}【来源：{params[key][0].source_name}】
            </p>
          ) : (
            <p>（无参数）</p>
          )}
        </div>,
      );
    }
    return items;
  };
  const reqDefaultParams = useCallback(async () => {
    return await userCfgParams().then((res) => {
      const resData = res.results;
      if (resData) {
        let notiData: any = {
          key: 'runLog',
          onClose: () => setOpen(false),
          message: (
            <>
              <p style={{ fontWeight: 'bold' }}>用户配置(Shift+Z 关闭/打开)</p>
              <Button
                shape="round"
                type="primary"
                style={{ marginTop: 10 }}
                onClick={async () => {
                  await clearUserTempParams().then((res) => {
                    message.success('清除成功！');
                    setOpen(false);
                    notification.close('runLog');
                  });
                }}
              >
                清空参数
              </Button>
              <Button
                shape="round"
                type="primary"
                style={{ marginLeft: 10 }}
                onClick={async () => {
                  await stopCasing().then((res) => {
                    message.success(res.msg);
                  });
                }}
              >
                中断执行
              </Button>
              {/* <Checkbox
                style={{
                  marginLeft: 10,
                  fontWeight: 'normal',
                  fontSize: '0.8em',
                }}
                defaultChecked={resData.only_failed_log}
                onChange={(e: CheckboxChangeEvent) => setUserCfgFunc({ only_failed_log: e.target.checked })}
              >
                <Tooltip
                  placement="top"
                  title="勾选此项只会记录失败日志，适用于批量造数等会产生大量日志的场景，避免卡顿"
                  overlayStyle={{ maxWidth: 600 }}
                >
                  <span style={{ fontSize: 14 }}>仅记录失败日志</span>
                  <ExclamationCircleTwoTone twoToneColor="#FAAD14" style={{ marginLeft: 3 }} />
                </Tooltip>
              </Checkbox> */}
              <Checkbox
                style={{
                  marginLeft: 10,
                  fontWeight: 'normal',
                  fontSize: '0.8em',
                }}
                defaultChecked={resData.failed_stop || true}
                onChange={(e: CheckboxChangeEvent) => setUserCfgFunc({ failed_stop: e.target.checked })}
              >
                <Tooltip
                  placement="top"
                  title="执行时出现失败则立即停止执行，不再跑后面的步骤"
                  overlayStyle={{ maxWidth: 600 }}
                >
                  <span style={{ fontSize: 14 }}>失败即停止</span>
                  <ExclamationCircleTwoTone twoToneColor="#FAAD14" style={{ marginLeft: 3 }} />
                </Tooltip>
              </Checkbox>
              执行环境：
              <Select
                defaultValue={resData.envir_id || 1}
                options={envirCand}
                style={{ minWidth: 80, marginBottom: 10 }}
                size="small"
                onChange={(v) => setUserCfgFunc({ envir_id: v })}
                fieldNames={{ label: 'name', value: 'id' }}
              ></Select>
              <Divider style={{ marginTop: 8 }} />
            </>
          ),
          description: '',
          style: {
            width: 600,
            height: 600,
            resize: 'both', //改变大小
          },
          duration: 0,
          placement: 'topLeft',
        };
        const desc = (
          <div style={{ maxHeight: 450, overflowY: 'auto', overflowX: 'hidden' }}>
            {renderParams(resData.params)}
          </div>
        );
        notiData['description'] = desc;
        return notiData;
      }
      return false;
    });
  }, [envirCand]);

  const openLogFunc = useCallback(
    (e: any) => {
      if (['z'].includes(e.key?.toLowerCase() || '') && e.shiftKey) {
        setOpen(!open);
        e.preventDefault();
      }
    },
    [envirCand, open],
  );
  const showForm = async (values: any = {}) => {
    await treeCaseModule().then((res) => setTreeCaseModuleData(res.results));
    await caseView(GET, { id: values.id }).then((res) => {
      values = res.results;
    });

    values['formType'] = PATCH;
    setCaseFormData({ ...values });
    setCaseOpen(true);
  };
  const onFormOk = async (values: any, closeForm: boolean = true) => {
    values.id = caseFormData.id;
    values.module_id = values.module_related.slice(-1)[0];
    return await caseView(POST, values).then((res: any) => {
      message.success('保存成功！');
      if (closeForm) {
        setOpen(false);
      }
    });
  };
  useEffect(() => {
    window.addEventListener('keydown', openLogFunc);
    if (!open) {
      notification.close('runLog');
    } else {
      message.loading('加载参数中...');
      reqDefaultParams().then((res) => {
        message.destroy();
        notification.open(res);
      });
    }
    return () => {
      notification.close('runLog');
      window.removeEventListener('keydown', openLogFunc);
    };
  }, [envirCand, open]);

  return caseOpen ? (
    <apiDataContext.Provider value={{ paramTypeCand, projectCand }}>
      <CaseForm
        open={caseOpen}
        setOpen={setCaseOpen}
        formData={caseFormData}
        treeCaseModuleData={treeCaseModuleData}
        formOk={onFormOk}
      />
    </apiDataContext.Provider>
  ) : (
    <></>
  );
};
