import { ProTable } from '@ant-design/pro-components';
import { RadioChangeEvent, Table } from 'antd';
import { Radio } from 'antd';
import React, { useState } from 'react';

const App: React.FC = () => {
  const [handlePagination, setHandlePagination] = useState<object>({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    onShowSizeChange: (current: number, size: number) => {
      setHandlePagination({ ...handlePagination, ...{ pageSize: size, current: current } });
    },
  });
  const dataSource = [
    {
      key: '1',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
    },
    {
      key: '2',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号',
    },
  ];

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '住址',
      dataIndex: 'address',
      key: 'address',
    },
  ];

  return <ProTable dataSource={dataSource} columns={columns} pagination={handlePagination} />;
};

export default App;
