import React, { useRef, useEffect, useState } from 'react';
import {
  ProFormText,
  ProFormRadio,
  ProFormItem,
  ProFormCheckbox,
  ProFormGroup,
  ProFormDigit,
} from '@ant-design/pro-components';
import {
  API,
  API_CASE,
  API_FOREACH,
  API_HEADER,
  API_HOST,
  API_SQL,
  API_VAR,
  DIY_CFG,
  DIY_FUNC_VAR_TIPS,
  MYSQL,
  POST,
  STEP_TYPE_LABEL,
} from '@/utils/constant';
import { Divider, InputNumber } from 'antd';
import { ApiContentForm, getApiInitValues, parseSaveSource } from '@/pages/apiData/form';
import { LimDrawerForm } from '@/components/limDrawerForm';
import { CaseStepForm, ForEachStepForm, HeaderForm, HostForm, SqlForm, VarForm } from './stepChildForm';
import { onStepFormOK, onControllerFormOK } from './func';
import { DiyFormText } from '@/components/diyAntdPomponent';
import { CodeEditNode } from '@/components/codeEdit';
import './index.css';
export const StepForm: React.FC<any> = ({ stepFormState, tableState, ...props }) => {
  const formData = stepFormState.formData;
  const stepType = formData.type;
  const formRef = useRef();
  const childRef = useRef<any>();
  let resultText = '';
  if (typeof formData.results === 'object') {
    resultText = formData.results?.msg || '';
  } else {
    resultText = formData.results;
  }
  const stepContentNodes = () => {
    switch (stepType) {
      case API:
        return <ApiContentForm formData={formData} formRef={formRef} childRef={childRef} />;
      case API_HEADER:
        return <HeaderForm formData={formData} />;
      case API_VAR:
        return <VarForm formData={formData} formRef={formRef} childRef={childRef} />;
      case API_HOST:
        return <HostForm formData={formData} formRef={formRef} />;
      case API_SQL:
        return <SqlForm formData={formData} formRef={formRef} />;
      case API_CASE:
        return <CaseStepForm childRef={childRef} formData={formData} formRef={formRef} />;
      case API_FOREACH:
        return <ForEachStepForm childRef={childRef} formData={formData} formRef={formRef} />;
      default:
        return <></>;
    }
  };
  const getInitValues = () => {
    let values = { step_name: formData.step_name || null };
    const stepParams = formData.params;
    switch (stepType) {
      case API_HEADER:
        values['value'] = stepParams || [];
        break;
      case API_VAR:
        const varValue = stepParams || {};
        for (let key in varValue) {
          values[key] = varValue[key];
        }
        break;
      case API_HOST:
        values['value'] = stepParams?.value || null;
        values['host_type'] = stepParams?.host_type || DIY_CFG;
        break;
      case API:
        values = { ...values, ...getApiInitValues(formData) };
        break;
      case API_SQL:
        values['db_type'] = stepParams?.db_type || MYSQL;
        values['sql_var'] = stepParams?.sql_var || null;
        values['sql_proj_related'] = stepParams?.sql_proj_related || [];
        values['database'] = stepParams?.database || null;
        values['sql'] = stepParams?.sql || null;
        break;
      case API_CASE:
        values['case_related'] = stepParams?.case_related || [];
        values['results'] = stepParams?.results || null;
        break;
      case API_FOREACH:
        values['times'] = stepParams?.times || [];
        values['break_code'] = stepParams?.break_code || null;
        break;
      default:
        break;
    }
    return values;
  };

  return (
    <LimDrawerForm
      width={stepFormState.formWidth}
      formRef={formRef}
      title={(formData.formType === POST ? '创建' : '修改') + `${STEP_TYPE_LABEL[stepType]}步骤`}
      initialValues={getInitValues()}
      formOk={(values: any) => {
        if ([API_CASE, API_FOREACH].includes(stepType)) {
          values.dataSource = childRef.current?.dataSource;
        } else if ([API, API_VAR].includes(stepType)) {
          values = parseSaveSource(values, childRef.current?.parmsType);
        }
        return onStepFormOK(values, tableState, stepFormState);
      }}
      open={stepFormState.open}
      setOpen={stepFormState.setOpen}
      {...props}
      formItems={
        <>
          <DiyFormText
            name="step_name"
            rules={[{ max: 100, message: '最多100个字' }]}
            label="步骤名"
            placeholder="请输入步骤名"
          />
          {stepContentNodes()}
          {resultText && ![API].includes(stepType) ? (
            <pre style={{ color: 'red', marginTop: 30 }}>{resultText}</pre>
          ) : null}
        </>
      }
    />
  );
};
export const ControllerForm = ({ stepFormState, tableState, ...props }: any) => {
  const formRef = useRef<any>();
  const controller_data = stepFormState.formData.controller_data || null;
  const [isController, setIsController] = useState<boolean>(controller_data ? true : false);
  const [reTimes, setReTimes] = useState<number>(controller_data?.re_times || 1);
  const [reInterval, setReInterval] = useState<number>(controller_data?.re_interval || 0);

  return (
    <LimDrawerForm
      width={stepFormState.formWidth}
      formRef={formRef}
      title="配置控制器"
      initialValues={{
        is_controller: controller_data ? true : false,
        execute_on: controller_data?.execute_on || null,
        sleep: controller_data?.sleep || null,
      }}
      formOk={(values: any) => {
        if (isController) {
          values['re_times'] = reTimes;
          values['re_interval'] = reInterval;
        }
        return onControllerFormOK(values, tableState, stepFormState);
      }}
      onOpenChange={(open: boolean) => {
        if (open) {
          setIsController(controller_data ? true : false);
          setReTimes(controller_data?.re_times || 0);
          setReInterval(controller_data?.re_interval || 1);
        }
      }}
      open={stepFormState.open}
      setOpen={stepFormState.setOpen}
      {...props}
      formItems={
        <>
          <ProFormCheckbox
            name="is_controller"
            fieldProps={{
              onChange: (e) => {
                setIsController(e.target.checked);
              },
            }}
          >
            开启配置控制
          </ProFormCheckbox>
          {isController && (
            <>
              <ProFormDigit
                width={100}
                label={<h3 className="title">延迟执行(等待X秒执行该步骤)</h3>}
                max={999}
                min={0}
                placeholder="0"
                name="sleep"
                fieldProps={{ addonAfter: '秒' }}
              />
              <h3 className="title" style={{ marginTop: 32, marginBottom: 16 }}>
                重试规则
              </h3>
              失败后，间隔{' '}
              <InputNumber
                style={{ width: 90 }}
                max={99}
                min={1}
                onChange={(v: any) => setReInterval(v)}
                value={reInterval}
                addonAfter="秒"
                size="small"
              />{' '}
              重试一次，最多重试{' '}
              <InputNumber
                addonAfter="次（为0时不重试）"
                size="small"
                max={20}
                min={0}
                onChange={(v: any) => setReTimes(v)}
                style={{ width: 190 }}
                value={reTimes}
              />
              （步骤为引用用例或循环器时不生效）
              <h3 className="title" style={{ marginTop: 32, marginBottom: 16 }}>
                执行该步骤的条件
              </h3>
              <ProFormItem name="execute_on">
                <CodeEditNode
                  initValue={
                    controller_data?.execute_on ||
                    '# ' +
                      DIY_FUNC_VAR_TIPS +
                      '\n# return=True时会执行该步骤，False时则跳过，如下方示例则会执行该步骤：\nreturn True'
                  }
                  onChangeFunc={(value: string) => {
                    formRef.current.setFieldsValue({ execute_on: value });
                  }}
                />
              </ProFormItem>
              <Divider />
            </>
          )}
        </>
      }
    />
  );
};
