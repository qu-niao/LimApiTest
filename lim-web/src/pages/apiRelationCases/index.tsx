import React, { useContext, useState } from 'react';
import apiDataContext from '@/pages/apiData/context';
import { columns } from './columns';
import { LimStandardPage } from '@/components/limStandardPage';
import { caseView, searchCaseByApi } from '@/services/apiData';
import { CaseForm } from '../apiCase/form';
import { GET, PATCH, POST } from '@/utils/constant';
import { message } from 'antd';
const ApiRelationCases = ({ apiId }: any) => {
  const { paramTypeCand, projectCand, pageRef } = useContext(apiDataContext);
  const [open, setOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<any>({}); //传递给弹窗显示的数据
  const showForm = async (type: string, values: any = {}) => {
    if (type == PATCH) {
      await caseView(GET, { id: values.id, api_id: apiId }).then((res) => {
        values = res.results;
      });
    }
    values['formType'] = type;
    setFormData({ ...values });
    setOpen(true);
  };
  const onFormOk = async (values: any, closeForm: boolean = true) => {
    const formType = formData.formType;
    if (formType === PATCH) {
      values.id = formData.id;
    }
    values.module_id = values.module_related.slice(-1)[0];
    return await caseView(POST, values).then((res: any) => {
      message.success('保存成功！');
      if (closeForm) {
        setOpen(false);
      }
      pageRef.current?.tableRef.current.onRefresh(formType);
    });
  };
  return (
    <LimStandardPage
      showForm={showForm}
      diyForm={{
        open: open,
        Items: (
          <apiDataContext.Provider value={{ paramTypeCand, projectCand }}>
            <CaseForm
              open={open}
              setOpen={setOpen}
              formData={formData}
              treeCaseModuleData={pageRef?.current?.treeRef?.current?.treeData}
              formOk={onFormOk}
            />
          </apiDataContext.Provider>
        ),
      }}
      reqService={searchCaseByApi}
      tableProps={{
        columns,
        otherParams: { api_id: apiId },
        toolBarRender: false,
        optionRender: (dom: any, _: any) => {
          return [dom.update];
        },
      }}
    />
  );
};
export default React.memo(ApiRelationCases);
