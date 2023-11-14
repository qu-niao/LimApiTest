import { PlusOutlined } from '@ant-design/icons';
import { DrawerForm, ProFormText } from '@ant-design/pro-components';
import { Button, Form } from 'antd';
import { useState } from 'react';

export default () => {
  const [form] = Form.useForm<{ name: string; company: string }>();
  const [drawerWidth, setDrawerWidth] = useState<number>(300);
  const [open, setOpen] = useState<boolean>(false);
  console.log('drawer最新的宽度应该为：', drawerWidth);
  return (
    <>
      <Button
        type="primary"
        onClick={() => {
          setOpen(true);
          setDrawerWidth(drawerWidth + 200);
        }}
      >
        <PlusOutlined />
        新建表单
      </Button>
      <DrawerForm<{
        name: string;
        company: string;
      }>
        width={drawerWidth}
        title="新建表单"
        form={form}
        autoFocusFirstInput
        drawerProps={{
          destroyOnClose: true,
          onClose: () => setOpen(false),
        }}
        open={open}
      >
        <ProFormText width="sm" name="id" label="主合同编号" />
      </DrawerForm>
    </>
  );
};
