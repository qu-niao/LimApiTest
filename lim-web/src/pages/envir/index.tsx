import React, { useRef } from 'react';
import Form from './form';
import { columns } from './columns';
import { LimStandardPage } from '@/components/limStandardPage';
import { changeEnvirPosition, envirView } from '@/services/conf';
import { message } from 'antd';
const Envir: React.FC = () => {
  const pageRef = useRef<any>();
  const changePosition = (id: number, type: string) => {
    changeEnvirPosition({ type, id }).then((res) => {
      message.success(res.msg);
      pageRef.current?.tableRef?.current?.onRefresh();
    });
  };
  return (
    <LimStandardPage
      pageRef={pageRef}
      Form={Form}
      reqService={envirView}
      tableProps={{
        columns,
        headerTitle: '环境列表',
        optionRender: (dom: any, record: any) => {
          return [
            dom.update,
            <a key="up" onClick={() => changePosition(record.id, 'up')}>
              上移
            </a>,
            <a key="down" onClick={() => changePosition(record.id, 'down')}>
              下移
            </a>,
            dom.delete,
          ];
        },
      }}
    />
  );
};
export default React.memo(Envir);
