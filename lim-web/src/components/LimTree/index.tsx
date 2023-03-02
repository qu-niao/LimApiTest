import React, { useImperativeHandle, useRef, useState } from 'react';
import { Tree, Spin } from 'antd';

const LimTree: React.FC<any> = ({ actionRef, treeSelectFunc, titleFunc }) => {
  const ref = useRef<any>();
  const [treeData, setTreeData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectId, setSelectId] = useState<any>(null);
  useImperativeHandle(actionRef, () => ({
    treeRef: ref,
    treeData: treeData,
    selectId: selectId,
    reqTree: (reqTreeFunc: any, params: any = {}) => {
      reqTreeFunc(params).then((res: any) => {
        setTreeData(res.results);
        setLoading(false);
      });
    },
  }));
  const setTree = (module_data: any) => {
    return module_data.map((item: any) => {
      let _json = { ...item };
      _json.name = titleFunc(item);
      _json.children = item.children ? setTree(item.children) : [];
      return _json;
    });
  };
  return (
    <Spin spinning={loading}>
      <Tree
        showLine={{ showLeafIcon: false }}
        onSelect={(value: any, e: any) => {
          const selectValue = value[0];
          if (e.selected && selectValue !== selectId) {
            treeSelectFunc(e.node);
            setSelectId(selectValue);
          }
        }}
        treeData={setTree(treeData)}
        fieldNames={{ title: 'name', key: 'id', children: 'children' }}
      />
    </Spin>
  );
};

export default React.memo(LimTree);
