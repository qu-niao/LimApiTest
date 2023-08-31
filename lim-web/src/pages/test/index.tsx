import { caseView } from '@/services/apiData';
import { GET } from '@/utils/constant';
import { ProTable } from '@ant-design/pro-components';

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

  const columns: any = [
    {
      title: '用例名称',
      dataIndex: 'name',
      sorter: true,
      search: true,
      width: 130,
    },
    {
      title: '修改时间',
      search: false,
      sorter: true,
      dataIndex: 'updated',
      width: 130,
      valueType: 'dateTime',
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      search: false,
      filters: true,
      filterMultiple: false, //控制单选还是多选
      valueType: 'tags',
    },
    {
      title: '创建人',
      search: false,
      key: 'creater_name',
      dataIndex: 'creater_name',
      width: 80,
    },
    {
      title: '修改人',
      search: false,
      dataIndex: 'updater_name',
      width: 80,
    },
    {
      title: '执行完成时间',
      dataIndex: 'latest_run_time',
      sorter: true,
      search: false,
      width: 130,
      valueType: 'dateTime',
    },
    {
      title: '创建时间',
      search: false,
      sorter: true,
      dataIndex: 'created',
      valueType: 'dateTime',
      width: 130,
    },
    {
      title: '操作',
      width: 180,
      fixed: 'right',
      dataIndex: 'option',
      valueType: 'option',
    },
  ];

  return (
    <ProTable
      columns={columns}
      request={async (pagationAndSearch, sorts, filters) => {
        const { current: page, pageSize: page_size, ...searchParams } = pagationAndSearch;
        console.log('ss', searchParams);
        const newFilters = { ...filters };
        //删除搜索和筛选条件为空的项
        [searchParams, newFilters].forEach((items) =>
          Object.keys(items).forEach(
            (key) => !items[key] && ![0, false].includes(items[key]) && delete items[key],
          ),
        );
        //处理排序条件
        let orderParams: object = {};
        if (sorts && Object.keys(sorts).length) {
          orderParams = { ordering: '' };
          for (let key in sorts) {
            orderParams['ordering'] = (sorts[key] === 'ascend' ? key : `-${key}`) + ',';
          }
          orderParams['ordering'] = orderParams['ordering'].slice(0, orderParams['ordering'].length - 1);
        }
        return await caseView(GET, {
          ...{ page, page_size },
          ...searchParams,
          ...newFilters,
          ...orderParams,
        }).then((res: any) => {
          return res.results;
        });
      }}
      // pagination={handlePagination}
    />
  );
};

export default App;
