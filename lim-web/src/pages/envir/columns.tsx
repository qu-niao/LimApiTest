export const columns = [
  {
    title: '序号',
    width: '10%',
    dataIndex: 'id',
    render: (_: any, __: any, index: number) => {
      return index + 1;
    },
  },
  {
    title: '环境名称',
    width: '50%',
    dataIndex: 'name',
  },

  {
    title: '操作',
    dataIndex: 'option',
    width: '40%',
    valueType: 'option',
  },
];
