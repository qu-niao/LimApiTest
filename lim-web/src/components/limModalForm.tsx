import { ModalForm } from '@ant-design/pro-components';
export const LimModalForm = ({
  diyCancel,
  title,
  initialValues,
  formItems,
  diyOnFinish,
  formOk,
  extraModalProps,
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
    <ModalForm
      width={width || 800}
      layout="vertical"
      title={title}
      formRef={formRef || null}
      initialValues={initialValues || {}}
      open={open}
      autoFocusFirstInput
      onFinish={diyOnFinish || onFinishFunc}
      {...props}
      modalProps={{
        zIndex: 102,
        ...extraModalProps,
        maskClosable: false,
        destroyOnClose: true,
        onCancel: diyCancel ? async () => await diyCancel() : () => setOpen(false),
      }}
    >
      {formItems}
    </ModalForm>
  );
};
