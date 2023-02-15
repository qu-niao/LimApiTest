import React from 'react';
import { userView } from '@/services/user';
import Form from './form';
import { columns } from './columns';
import { LimStandardPage } from '@/components/limStandardPage';
const User: React.FC = () => {
  return (
    <LimStandardPage
      Form={Form}
      reqService={userView}
      tableProps={{ columns, headerTitle: '用户列表' }}
    />
  );
};
export default React.memo(User);
