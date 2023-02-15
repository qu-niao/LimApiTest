import React from 'react';
import { ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { POST } from '@/utils/constant';
import { Tabs, Collapse } from 'antd';
import { LimModalForm } from '@/components/limModalForm';
import { CaretRightOutlined } from '@ant-design/icons';
import './index.css';
const { Panel } = Collapse;
const Form: React.FC<any> = ({ formData, ...props }) => {
  const getInitialValues = () => {
    let values = {
      name: formData.name || null,
      remark: formData.remark || null,
    };
    formData?.envir_data?.forEach((item: any) => {
      for (let key in item.data || {}) {
        values[`envir_${item.key}_${key}`] = key === 'db' ? Object.values(item.data[key]) : item.data[key];
      }
    });
    return values;
  };
  return (
    <LimModalForm
      title={formData.formType === POST ? '创建项目' : '修改项目'}
      initialValues={getInitialValues()}
      width={900}
      {...props}
      formItems={
        <>
          <ProFormText
            width="md"
            name="name"
            allowClear={false}
            rules={[
              { required: true, message: '项目名称必填' },
              { type: 'string' },
              { max: 36, message: '最多36个字' },
            ]}
            label="项目名称"
            placeholder="请输入项目名称"
          />
          <Collapse
            bordered={false}
            ghost
            style={{ padding: '10px 0px' }}
            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
          >
            <Panel
              className="remark"
              forceRender={true}
              style={{ paddingBottom: 0, marginTop: -28 }}
              header={<span style={{ fontWeight: 'bold' }}>查看备注</span>}
              key="1"
            >
              <ProFormTextArea
                name="remark"
                rules={[{ type: 'string' }]}
                placeholder="请输入备注信息"
                fieldProps={{
                  autoSize: { minRows: 2 },
                }}
              />
            </Panel>
          </Collapse>
          {/* <Divider /> */}
          <p style={{ fontWeight: 'bold' }}>环境配置</p>
          <a style={{ float: 'right' }} onClick={() => window.open(`/config/envir`)}>
            维护环境项
          </a>
          <Tabs type="card" tabBarGutter={0} defaultActiveKey="1" items={formData?.envir_data || []} />
        </>
      }
    />
  );
};
export default React.memo<any>(Form);
