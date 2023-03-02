import { useState, forwardRef, useRef, useEffect } from 'react';
import { Col, Switch, Tooltip, Popconfirm, message } from 'antd';
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
  const [treeEditDisplay, setTreeEditDisplay] = useState<string>('none');
  let reqTreeParams: object;
  reqTreeParams = extraParams || {};
  actionLabel = actionLabel ? actionLabel : '模块';
  useEffect(() => {
    treeRef.current.reqTree(treeService, reqTreeParams);
  }, []);
  const showForm = (type: string, values: any = {}) => {
    values['formType'] = type;
    setFormData({ ...values });
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
        <Tooltip title={item.name} placement="right" overlayStyle={{ maxWidth: 300 }}>
          <span className={styles.hideTreeName}>{item.name}</span>
        </Tooltip>
        <span
          key={item.id}
          style={{
            zIndex: 1,
            width: '80px',
            display: treeEditDisplay,
          }}
        >
          <Tooltip title={`增加${actionLabel}`}>
            <PlusCircleOutlined style={{ marginLeft: 10 }} onClick={(e) => showForm(POST, item)} />
          </Tooltip>
          <Tooltip title={`编辑${actionLabel}`}>
            <EditOutlined onClick={(e) => showForm(PATCH, item)} style={{ marginLeft: 10 }} />
          </Tooltip>
          <Popconfirm
            title="您确定要删除吗？"
            onConfirm={() =>
              onFinishService(DELETE, item.id).then((res: any) =>
                treeRef.current.reqTree(treeService, reqTreeParams),
              )
            }
          >
            <Tooltip title={`删除${actionLabel}`}>
              <DeleteOutlined style={{ marginLeft: 10 }} />
            </Tooltip>
          </Popconfirm>
        </span>
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
            <li className={styles.operationStyle} onClick={() => showForm(POST)}>
              ＋增加主{actionLabel}
            </li>
            <li>
              <Switch
                checkedChildren="关闭编辑"
                unCheckedChildren="开启编辑"
                onChange={(e) => setTreeEditDisplay(e ? '' : 'none')}
              />
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
