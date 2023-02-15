import React from 'react';
import { ProFormText } from '@ant-design/pro-form';
import { LimModalForm } from '@/components/limModalForm';

export const PwdForm: React.FC<any> = ({ formData, ...props }) => {
  return (
    <LimModalForm
      title="修改密码"
      width={400}
      {...props}
      formItems={
        <>
          <ProFormText
            width="md"
            name="password"
            allowClear={false}
            rules={[
              { required: true, message: '新密码必填！' },
              { type: 'string' },
              { max: 30, message: '最多30个字' },
            ]}
            label="新密码"
            placeholder="请输入新密码"
          />
        </>
      }
    />
  );
};
