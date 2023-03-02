export const columns = [
  {
    title: '用户名',
    width: 100,
    dataIndex: 'username',
  },
  {
    title: '姓名',
    dataIndex: 'real_name',
    width: 100,
  },
  {
    title: '邮箱地址',
    dataIndex: 'email',
    width: 200,
  },
  {
    title: '加入时间',
    dataIndex: 'date_joined',
    width: 200,
    valueType: 'dateTime',
  },
  {
    title: '状态',
    dataIndex: 'is_active',
    width: 100,
    filters: true,
    filterMultiple: false,
    valueEnum: {
      true: { text: '启用', status: 'Success' },
      false: { text: '禁用', status: 'Error' },
    },
  },
  {
    title: '操作',
    dataIndex: 'option',
    width: 120,
    valueType: 'option',
  },
];
