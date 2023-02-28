import React from 'react';
import { ProFormText } from '@ant-design/pro-components';
import { POST } from '@/utils/constant';
import { LimModalForm } from '@/components/limModalForm';
const Form: React.FC<any> = ({ formData, ...props }) => {
  return (
    <LimModalForm
      title={formData.formType === POST ? '创建环境' : '修改环境'}
      initialValues={{
        name: formData.name || null,
      }}
      {...props}
      formItems={
        <ProFormText
          width="md"
          name="name"
          rules={[
            { required: true, message: '环境名称必填' },
            { type: 'string' },
            { max: 36, message: '最多36个字' },
          ]}
          label="环境名称"
          placeholder="请输入环境名称"
        />
      }
    />
  );
};
export default React.memo<any>(Form);
