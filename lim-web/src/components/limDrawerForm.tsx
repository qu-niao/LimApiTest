import { DrawerForm } from '@ant-design/pro-components';
export const LimDrawerForm = ({
  diyCancel,
  title,
  initialValues,
  formItems,
  diyOnFinish, //替换完整的保存事件
  formOk, //仅替换保存方法
  extraDrawerProps,
  formRef,
  open,
  setOpen,
  width,
  ...props
}: any) => {
  const onFinishFunc = async (values: any) => {
    const func = formOk;
    try {
      await func(values).then(
        () => {
          //成功保存则返回true
          return true;
        },
        () => {
          //保存失败则返回false
          return false;
        },
      );
    } catch (e) {
      console.log('error', e);
    }
  };

  return (
    <DrawerForm
      width={width || 800}
      layout="vertical"
      title={title}
      formRef={formRef || null}
      initialValues={initialValues || {}}
      open={open}
      autoFocusFirstInput
      onFinish={diyOnFinish || onFinishFunc}
      {...props}
      drawerProps={{
        zIndex: 102,
        maskClosable: false,
        destroyOnClose: true,
        onClose: diyCancel ? async () => await diyCancel() : () => setOpen(false),
        ...extraDrawerProps,
   
      }}
    >
      {formItems}
    </DrawerForm>
  );
};
