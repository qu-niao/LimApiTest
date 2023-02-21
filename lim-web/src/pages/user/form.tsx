import React, { useState } from 'react';
import { ProFormText, ProFormRadio, ProFormGroup } from '@ant-design/pro-components';
import { POST } from '@/utils/constant';
import { LimModalForm } from '@/components/limModalForm';
const Form: React.FC<any> = ({ formData, ...props }) => {
  return (
    <LimModalForm
      title={formData.formType === POST ? '创建用户' : '修改用户'}
      initialValues={{
        username: formData.username || null,
        real_name: formData.real_name || null,
        email: formData.email || null,
        is_superuser: formData.is_superuser || false,
      }}
      {...props}
      formItems={
        <>
          <ProFormGroup>
            <ProFormText
              width="md"
              name="username"
              rules={[
                { required: true, message: '用户名必填' },
                { type: 'string' },
                { max: 18, message: '最多18个字' },
              ]}
              label="用户名"
              placeholder="请输入用户名"
            />
            <ProFormText
              width="md"
              name="real_name"
              rules={[
                { required: true, message: '必填！' },
                { type: 'string' },
                { max: 18, message: '最多18个字' },
              ]}
              label="姓名"
              placeholder="请输入名称"
            />
          </ProFormGroup>
          <ProFormText width="xl" name="email" label="邮箱号" placeholder="请输入邮箱号" />
          {/* <ProFormRadio.Group
        name="is_active"
        label="用户状态"
        options={[
          {
            label: '启用',
            value: true,
          },
          {
            label: '禁用',
            value: false,
          },
        ]}
      /> */}
        </>
      }
    />
  );
};
export default React.memo<any>(Form);
