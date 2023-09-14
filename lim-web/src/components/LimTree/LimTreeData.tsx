import { useState, forwardRef, useRef, useEffect } from 'react';
import { Col, Switch, Tooltip, Popconfirm, message, Dropdown } from 'antd';
import { EditOutlined, PlusCircleOutlined, DeleteOutlined, RedoOutlined } from '@ant-design/icons';
import ComTree from '@/components/LimTree';
import styles from './index.css';
import { ActionTreeForm } from '@/components/LimTree/form';
import { DELETE, PATCH, POST } from '@/utils/constant';
//函数组件多ref使用forwardRef
export const LimTreeData = ({
  treeRef,
  editDisabled, //控制是否显示编辑模块的按钮
  extraParams, //查询时，携带的额外参数
  extraSaveParams = {}, //保存时，携带的额外参数
  onFinishService, //（增加/编辑/删除等）的执行函数
  actionLabel, //操作（增加/编辑/删除等）的文本
  treeService, //请求树数据的方法
  treeTitle, //树子数据的名称
  tableRef,
  setCurrentMod,
}: any) => {
  const [open, setOpen] = useState<boolean>(false); //控制弹窗显示还是隐藏
  const [formData, setFormData] = useState<any>({}); //传递给弹窗显示的数据
  let reqTreeParams: object;
  reqTreeParams = extraParams || {};
  actionLabel = actionLabel ? actionLabel : '模块';
  useEffect(() => {
    treeRef.current.reqTree(treeService, reqTreeParams);
  }, []);
  const showForm = (type: string, values: any = {}) => {
    let newValues = { ...values, formType: type };
    if (type === POST) {
      newValues.name = null;
    }
    setFormData(newValues);
    setOpen(true);
  };
  const onModuleFormOk = async (values: any) => {
    const moduleFormData = formData;
    if (moduleFormData.formType === PATCH) {
      values.id = moduleFormData.id;
    } else if (moduleFormData.id) {
      values.parent = moduleFormData.id;
    }
    values = { ...values, ...extraSaveParams };
    return await onFinishService(moduleFormData.formType, values).then((res: any) => {
      message.success('操作成功！');
      setOpen(false);
      treeRef.current.reqTree(treeService, reqTreeParams);
    });
  };
  const setTreeTitle = (item: any) => {
    const title = (
      <div style={{ display: 'flex' }}>
        <Dropdown
          menu={{
            items: [
              {
                label: `增加子${actionLabel}`,
                key: 'add',
                onClick: () => showForm(POST, item),
              }, // 菜单项务必填写 key
              {
                label: `修改${actionLabel}`,
                key: 'update',
                onClick: () => showForm(PATCH, item),
              },
              {
                label: (
                  <Popconfirm
                    title="您确定要删除吗？"
                    okText="是"
                    cancelText="否"
                    onConfirm={() =>
                      onFinishService(DELETE, item.id).then((res: any) =>
                        treeRef.current.reqTree(treeService, reqTreeParams),
                      )
                    }
                  >
                    <span style={{ color: 'red' }}>{`删除${actionLabel}`}</span>{' '}
                  </Popconfirm>
                ),
                key: 'delete',
              },
            ],
          }}
          trigger={['contextMenu']}
        >
          <Tooltip title={item.name} placement="right" overlayStyle={{ maxWidth: 300 }}>
            <span className={styles.hideTreeName}>{item.name}</span>
          </Tooltip>
        </Dropdown>
      </div>
    );
    return title;
  };
  const treeOnSelect = (value: any) => {
    setCurrentMod && setCurrentMod(value);
    tableRef.current.onSelect({ module_id: value.id });
  };
  return (
    <>
      {open && <ActionTreeForm open={open} setOpen={setOpen} formData={formData} formOk={onModuleFormOk} />}
      <div
        key="module"
        style={{
          backgroundColor: 'white',
          height: 'calc(100vh - 80px)',
          overflow: 'auto',
        }}
      >
        {!editDisabled ? (
          <ul className={styles.modTreeCfg}>
            <li style={{ fontWeight: 'bold', marginLeft: 10 }}>模块树</li>
            <li className={styles.operationStyle} style={{ marginRight: 10 }} onClick={() => showForm(POST)}>
              ＋增加主{actionLabel}
            </li>
          </ul>
        ) : (
          <>
            <span style={{ fontWeight: 'bold' }}>模块树</span>
            <span
              className={styles.operationStyle}
              style={{ marginLeft: 60 }}
              onClick={() => treeRef.current.reqTree(treeService, reqTreeParams)}
            >
              刷新
              <RedoOutlined style={{ marginLeft: 3 }} />
            </span>
          </>
        )}
        <ComTree titleFunc={treeTitle || setTreeTitle} treeSelectFunc={treeOnSelect} actionRef={treeRef} />
      </div>
    </>
  );
};
