import React, { useImperativeHandle, useContext, useRef, useState, useEffect, useCallback } from 'react';
import { ProTable, ProProvider } from '@ant-design/pro-components';
import { Button, Tag, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { GET, DELETE, POST, PATCH, DELETE_CONFIRM_TIP } from '@/utils/constant';

const Table: React.FC<any> = ({
  actionRef,
  reqService,
  createButDisabled,
  headerTitle,
  showForm,
  columns,
  otherParams,
  optionRender,
  optionRefresh,
  colRefresh,
  ...props
}) => {
  const ref = useRef<any>();
  const proViderValues = useContext(ProProvider);
  const [createBut, setCreateBut] = useState<boolean>(createButDisabled || false); //用于判断新建按钮是否可用
  const defaultPageSize = localStorage.getItem('defaultPageSize') || 10;
  const [dataLength, setDataLength] = useState<number>(0); //列表返回数据的长度（行数）
  const [otherReqParams, setOtherReqParams] = useState<object>(otherParams || {}); //额外参数
  //分页器
  const [handlePagination, setHandlePagination] = useState<object>({
    current: 1,
    pageSize: defaultPageSize,
    showSizeChanger: true,
    onShowSizeChange: (current: number, size: number) => {
      localStorage.setItem('defaultPageSize', size.toString());
      setHandlePagination({ ...handlePagination, ...{ pageSize: size, current: current } });
    },
  });
  const deleteDataFunc = async (func: any, record_id: any) => {
    await func(DELETE, record_id).then((_: any) => {
      const currentPage = ref.current?.pageInfo.current || 1;
      if (currentPage > 1 && dataLength <= 1) {
        //在非首页的最后一条数据被删除时，改变页码为前一页进行请求
        setHandlePagination({ ...handlePagination, ...{ current: currentPage - 1 || 1 } });
      }
      ref.current.reload();
    });
  };
  //默认的表单操作dom
  const defaultColumnDom = {
    update: (record: any) => (
      <a key="update" onClick={() => showForm(PATCH, record)}>
        修改
      </a>
    ),
    delete: (record: any) => (
      <Popconfirm
        key="delete"
        title={DELETE_CONFIRM_TIP}
        onConfirm={() => deleteDataFunc(reqService, record.id)}
      >
        <a> 删除 </a>
      </Popconfirm>
    ),
  };
  //设置表单options（操作栏）的方法
  const setColumnsOptions = () => {
    for (let i = 0; i < columns.length; i++) {
      if (columns[i].dataIndex === 'option') {
        if (!optionRender) {
          //没有配置optionRender则默认增加修改、删除功能
          columns[i].render = (_: any, record: any) => [
            defaultColumnDom.update(record),
            defaultColumnDom.delete(record),
          ];
        } else {
          columns[i].render = (_: any, record: any) =>
            optionRender(
              { update: defaultColumnDom.update(record), delete: defaultColumnDom.delete(record) },
              record,
            );
        }
        break;
      }
    }
  };
  setColumnsOptions();

  useImperativeHandle(actionRef, () => ({
    tableRef: ref,
    allowRefresh: !createBut,
    comDeleteData: deleteDataFunc,
    onRefresh: (formType: string = PATCH) =>
      formType === POST ? ref.current.reloadAndRest() : ref.current.reload(),
    onSearch: (searchParams: any) => {
      setOtherReqParams(searchParams);
      ref.current.reloadAndRest();
    },
    onSelect: (selectParams: object, formType: string = '') => {
      setCreateBut(false);
      setOtherReqParams({ ...otherReqParams, ...selectParams });
      formType === PATCH ? ref.current.reload() : ref.current.reloadAndRest();
    },
  }));

  return (
    <ProProvider.Provider
      value={{
        ...proViderValues,
        valueTypeMap: {
          //自定义valueType
          tags: {
            render: (...props: any) => {
              const type = props[0];
              const { valueEnum } = props[1];
              return (
                <Tag style={{ minWidth: 50 }} color={valueEnum[type].status}>
                  {valueEnum[type].text}
                </Tag>
              );
            },
          },
        },
      }}
    >
      <ProTable
        actionRef={ref}
        columns={columns}
        scroll={{ y: 'calc(100vh - 300px)' }}
        params={otherReqParams}
        request={async (pagationAndSearch, sorts, filters) => {
          const { current: page, pageSize: page_size, ...searchParams } = pagationAndSearch;
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

          return await reqService(GET, {
            ...{ page, page_size },
            ...searchParams,
            ...newFilters,
            ...orderParams,
          }).then((res: any) => {
            setDataLength(res.results.data.length);
            return res.results;
          });
        }}
        rowKey="id"
        pagination={handlePagination}
        size="middle"
        headerTitle={<h3 style={{ fontWeight: 'bold' }}> {headerTitle}</h3>}
        search={false}
        options={{ density: false, reload: false }}
        toolBarRender={() => [
          <Button disabled={createBut} type="primary" icon={<PlusOutlined />} onClick={() => showForm(POST)}>
            新建
          </Button>,
        ]}
        dateFormatter="string"
        {...props}
      />
    </ProProvider.Provider>
  );
};

export default React.memo(Table);
