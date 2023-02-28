import { STATUS_LABEL } from '@/utils/constant';

export const columns = [
  {
    title: '用例名称',
    width: '30%',
    dataIndex: 'name',
  },
  {
    title: '创建人',
    search: false,
    key: 'creater_name',
    dataIndex: 'creater_name',
    width: '10%',
  },
  {
    title: '修改人',
    search: false,
    dataIndex: 'updater_name',
    width: '10%',
  },
  {
    title: '创建时间',
    search: false,
    sorter: true,
    dataIndex: 'created',
    valueType: 'dateTime',
    width: '15%',
  },
  {
    title: '修改时间',
    search: false,
    sorter: true,
    dataIndex: 'updated',
    valueType: 'dateTime',
    width: '15%',
  },

  {
    title: '状态',
    dataIndex: 'status',
    width: '10%',

    valueType: 'tags',
    valueEnum: STATUS_LABEL,
  },
  {
    title: '操作',
    dataIndex: 'option',
    width: '10%',
    valueType: 'option',
  },
];
