import { useRef, useState, useEffect, useImperativeHandle } from 'react';
import LimTable from '@/components/limTable';
import { Row, Col, message } from 'antd';
import { PATCH } from '@/utils/constant';
import { LimTreeData } from './LimTree/LimTreeData';
export const LimStandardPage = ({
  pageRef, //limpage的ref
  treeProps, //树
  Form, //弹窗组件
  diyForm, //自定义弹窗（弹窗组件，弹窗事件等）
  showForm, //自定义打开弹窗的方法
  onFomrOk, //自定义弹窗确定的方法
  reqService, //基础请求接口
  tableProps, //表格
  ExtraItems, //页面其它要展示的组件
  tableVisable = true, //控制表格是否可见
}: any) => {
  const tableRef = useRef<any>();
  const treeRef = useRef<any>();
  const formRef = useRef<any>();
  let treeSpan;
  if (treeProps) {
    treeSpan = treeProps.treeSpan;
    delete treeProps.treeSpan;
  } else {
    treeSpan = 0;
  }
  const [open, setOpen] = useState<boolean>(false); //控制弹窗显示还是隐藏
  const [formData, setFormData] = useState<any>({}); //传递给弹窗显示的数据
  if (pageRef) {
    useImperativeHandle(pageRef, () => ({
      open,
      setOpen,
      formData,
      setFormData,
      tableRef,
      treeRef,
      formRef,
    }));
  }
  const defaultShowForm = (type: string, values: any = {}) => {
    values['formType'] = type;
    setFormData({ ...values });
    setOpen(true);
  };
  const defaultOnFormOk = async (values: any) => {
    const formType = formData.formType;
    if (formType === PATCH) {
      values.id = formData.id;
    }
    return await reqService(formType, values).then((res: any) => {
      message.success('操作成功！');
      setOpen(false);
      tableRef.current.onRefresh(formType);
    });
  };

  return (
    <Row gutter={8}>
      {treeProps && (
        <Col span={treeSpan}>
          <LimTreeData {...treeProps} treeRef={treeRef} tableRef={tableRef} />
        </Col>
      )}
      <Col span={24 - treeSpan}>
        {tableVisable ? (
          <LimTable
            actionRef={tableRef}
            reqService={reqService}
            showForm={showForm || defaultShowForm}
            {...tableProps}
          />
        ) : null}
      </Col>
      {open && (
        <Form
          formRef={formRef}
          onFinishService={reqService}
          open={open}
          setOpen={setOpen}
          formData={formData}
          formOk={onFomrOk || defaultOnFormOk}
        />
      )}
      {diyForm?.open && diyForm.Items}
      {ExtraItems}
    </Row>
  );
};
