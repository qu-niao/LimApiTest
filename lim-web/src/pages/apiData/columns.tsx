import { REQ_METHOD_LABEL } from '@/utils/constant';

export const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    width: '25%',
  },
  {
    title: '请求方法',
    key: 'method',
    align: 'center',
    dataIndex: 'method',
    width: '10%',
    valueType: 'tags',
    filters: true,
    filterMultiple: false, //控制单选还是多选
    search: false,
    valueEnum: REQ_METHOD_LABEL,
  },
  {
    title: '接口地址',
    key: 'path',
    dataIndex: 'path',
    ellipsis: true,
    width: '35%',
  },
  {
    title: '创建时间',
    dataIndex: 'created',
    valueType: 'dateTime',
    width: '18%',
  },

  {
    title: '操作',
    dataIndex: 'option',
    width: '12%',
    valueType: 'option',
  },
];
