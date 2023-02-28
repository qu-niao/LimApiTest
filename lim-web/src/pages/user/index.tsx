import React, { useRef } from 'react';
import { userView } from '@/services/user';
import Form from './form';
import { columns } from './columns';
import { LimStandardPage } from '@/components/limStandardPage';
import { PATCH } from '@/utils/constant';
const User: React.FC = () => {
  const pageRef = useRef<any>();
  return (
    <LimStandardPage
      pageRef={pageRef}
      Form={Form}
      reqService={userView}
      tableProps={{
        columns,
        headerTitle: '用户列表',
        optionRender: (dom: any, record: any) => {
          return [
            dom.update,
            <a
              key="active"
              onClick={() =>
                userView(PATCH, { id: record.id, is_active: !record.is_active }).then((res) =>
                  pageRef?.current?.tableRef?.current.onRefresh(PATCH),
                )
              }
            >
              {record.is_active ? '禁用' : '启用'}
            </a>,
          ];
        },
      }}
    />
  );
};
export default React.memo(User);
