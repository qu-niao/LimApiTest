import React, { useContext, useState } from 'react';
import apiDataContext from '@/pages/apiData/context';
import { columns } from './columns';
import { LimStandardPage } from '@/components/limStandardPage';
import { caseView, searchCaseByApi } from '@/services/apiData';
import { CaseForm } from '../apiCase/form';
import { GET, PATCH, POST } from '@/utils/constant';
import { ProForm } from '@ant-design/pro-components';
import { message } from 'antd';
const ApiCaseFormPage = ({ apiId }: any) => {
  return (
    <ProForm
      onFinish={async (values) => {
        console.log(values);

        message.success('提交成功');
      }}
      // request={async () => {
      //   await waitTime(1500);
      //   return {
      //     name: '蚂蚁设计有限公司',
      //     useMode: 'chapter',
      //   };
      // }}
      autoFocusFirstInput
    ></ProForm>
  );
};
export default React.memo(ApiCaseFormPage);
