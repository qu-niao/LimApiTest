import { API_HEADER, API_HOST, API_VAR, STATUS_LABEL, STEP_TYPE_LABEL } from '@/utils/constant';
import { Tag } from 'antd';
export const stepColumns = (showModal:any=null) => {
  return [
    {
      title: '类型',
      dataIndex: 'type',
      className: 'drag-visible',
      width: '10%',
      render: (v: any, record: any) => {
        return (
          <Tag color={[API_HEADER, API_HOST, API_VAR].includes(v) ? 'green' : 'blue'}>
            {STEP_TYPE_LABEL[record.type]}
          </Tag>
        );
      },
    },
    {
      title: '步骤名称',
      dataIndex: 'step_name',
      key: 'step_name',
      render: (v: string, record: any) => {
        return (
          <>
            {record.controller_data ? <Tag color="purple">含有控制器</Tag> : null}
            {v}
          </>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: '10%',
      render: (v: any, record: any) => {
        const controller_data = record.controller_data;
        return (
          <>
            {controller_data?.sleep ? (
              <Tag color="blue" style={{ marginBottom: 6 }}>
                延迟{controller_data.sleep}秒执行
              </Tag>
            ) : null}
            {(controller_data && record.retried_times && (
              <Tag color="purple" style={{ marginBottom: 6 }}>
                重试{record.retried_times}次
              </Tag>
            )) ||
              null}
            <Tag color={STATUS_LABEL[v].status}>{STATUS_LABEL[v].text}</Tag>
          </>
        );
      },
    },
    {
      title: '操作',
      key: 'operation',
      render: (record: any) => (
        <a key="update" onClick={() => showModal(record)}>
          查看详情
        </a>
      ),
    },
  ];
};
