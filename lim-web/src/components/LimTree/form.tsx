import { LimModalForm } from '@/components/limModalForm';
import { ProFormText } from '@ant-design/pro-form';
import { POST } from '@/utils/constant';
export const ActionTreeForm = ({ formData, ...props }: any) => {
  return (
    <LimModalForm
      title={formData.formType === POST ? `创建模块` : `修改模块`}
      initialValues={{
        name: formData.name || null,
      }}
      {...props}
      formItems={
        <ProFormText
          width="md"
          name="name"
          rules={[
            { required: true, message: `模块名称必填` },
            { type: 'string' },
            { max: 60, message: '最多60个字' },
          ]}
          label="模块名称"
          placeholder="请输入模块名称"
        />
      }
    />
  );
};
