import React, { useRef, useState } from 'react';
import { projectEnvirData, projectView, testDbConnect } from '@/services/project';
import Form from './form';
import { message } from 'antd';
import { columns } from './columns';
import { ExclamationCircleTwoTone } from '@ant-design/icons';
import { Tabs, Divider, Tooltip, Button } from 'antd';
import { POST } from '@/utils/constant';
import {
  ProFormText,
  ProFormList,
  ProFormDigit,
  ProFormDependency,
  ProFormGroup,
  ProFormSelect,
} from '@ant-design/pro-form';
const testConnect = async (formRef: any, envir_id: number, index: number, setLoading: any) => {
  const dbData = formRef?.current.getFieldValue(`envir_${envir_id}_db`)[index];
  setLoading(true);
  await testDbConnect(dbData).then(
    (res) => {
      message.success(res.msg);
    },
    () => {},
  );
  setLoading(false);
};
const EnvirTabs = ({ item, formRef }: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <Tabs
      // type="card"
      // tabBarGutter={0}

      defaultActiveKey="host"
      items={[
        {
          label: '请求地址',
          key: 'host',
          forceRender: true,
          children: (
            <ProFormText
              width="md"
              name={`envir_${item.id}_host`}
              allowClear={false}
              rules={[{ type: 'string' }, { max: 200, message: '最多200个字' }]}
              placeholder="请输入请求地址"
            />
          ),
        },
        {
          label: '数据库连接',
          key: 'db',
          forceRender: true,
          children: (
            <div style={{ overflowY: 'auto', maxHeight: 360 }}>
              <ProFormList name={`envir_${item.id}_db`} alwaysShowItemLabel={true}>
                {(f, index, { add, remove }) => {
                  return (
                    <ProFormDependency name={['db_name', 'db_host', 'db_port', 'db_pwd', 'db_database']}>
                      {({}) => {
                        return (
                          <>
                            <ProFormGroup>
                              <ProFormText
                                name="db_con_name"
                                width="md"
                                placeholder="请输入连接名称"
                                allowClear={false}
                                rules={[
                                  { required: true, message: '连接名称必填！' },
                                  { type: 'string' },
                                  { max: 200, message: '最多200个字' },
                                ]}
                                label={
                                  <Tooltip
                                    overlayStyle={{ maxWidth: 600 }}
                                    placement="right"
                                    title="各环境下相同数据库的连接名称需保持一致，才能在切换环境执行任务时生效"
                                  >
                                    连接名称{index + 1}
                                    <ExclamationCircleTwoTone
                                      twoToneColor="#FAAD14"
                                      style={{ marginLeft: 3 }}
                                    />
                                  </Tooltip>
                                }
                              />
                              <ProFormSelect
                                name="db_type"
                                label="数据库类型"
                                allowClear={false}
                                options={[
                                  { label: 'Mysql', value: 'mysql' },
                                  { label: 'Redis', value: 'rds', disabled: true },
                                  { label: 'Oracle', value: 'oracle', disabled: true },
                                ]}
                                placeholder="选择数据库"
                                rules={[
                                  {
                                    required: true,
                                    message: '请选择数据库类型！',
                                  },
                                ]}
                              />
                              <ProFormText
                                name="db_host"
                                allowClear={false}
                                rules={[
                                  { required: true, message: '数据库地址必填！' },
                                  { type: 'string' },
                                  { max: 200, message: '最多200个字' },
                                ]}
                                label="数据库地址"
                              />
                            </ProFormGroup>
                            <ProFormGroup>
                              <ProFormText
                                name="db_user"
                                allowClear={false}
                                rules={[
                                  { required: true, message: '用户名必填！' },
                                  { max: 200, message: '最多200个字' },
                                ]}
                                label="用户名"
                              />
                              <ProFormText
                                name="db_pwd"
                                allowClear={false}
                                rules={[{ required: true, message: '密码必填！' }]}
                                label="密码"
                              />
                              <ProFormDigit
                                width="xs"
                                name="db_port"
                                rules={[{ required: true, message: '端口号必填' }]}
                                label="端口号"
                              />
                            </ProFormGroup>
                            <ProFormGroup>
                              <ProFormText
                                name="ssh_host"
                                allowClear={false}
                                rules={[{ max: 200, message: '最多200个字' }]}
                                label="跳板机地址"
                              />
                              <ProFormText
                                name="ssh_user"
                                allowClear={false}
                                rules={[{ max: 200, message: '最多200个字' }]}
                                label="跳板机用户名"
                              />
                              <ProFormText
                                name="ssh_pwd"
                                allowClear={false}
                                rules={[{ max: 200, message: '最多200个字' }]}
                                label="跳板机密码"
                              />
                              <Button
                                type="primary"
                                style={{ top: 30 }}
                                loading={loading}
                                onClick={() => testConnect(formRef, item.id, index, setLoading)}
                              >
                                测试连接
                              </Button>
                            </ProFormGroup>
                            <Divider />
                          </>
                        );
                      }}
                    </ProFormDependency>
                  );
                }}
              </ProFormList>
            </div>
          ),
        },
      ]}
    />
  );
};
export default EnvirTabs;
