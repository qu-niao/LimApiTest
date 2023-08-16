import React, { useState, useEffect, useRef } from 'react';
import { message } from 'antd';
import Form from './form';
import { columns } from './columns';
import { treeApiModule, apiDataView, apiModuleView } from '@/services/apiData';
import apiDataContext from './context';
import { paramType } from '@/services/conf';
import { GET, PATCH, POST } from '@/utils/constant';
import { projectView } from '@/services/project';
import { LimStandardPage } from '@/components/limStandardPage';
const ApiData = ({ project_data }: any) => {
  const pageRef = useRef<any>(); //table用
  const { id: project_id, name: project_name } = project_data;
  const [paramTypeCand, setParamTypeCand] = useState([]);
  const [projectCand, setProjectCand] = useState([]);
  const [open, setOpen] = useState<boolean>(false); //控制弹窗显示还是隐藏
  const [formData, setFormData] = useState<any>({}); //传递给弹窗显示的数据
  useEffect(() => {
    paramType().then((res) => setParamTypeCand(res.results));
    projectView(GET).then((res) => setProjectCand(res.results));
  }, []);
  const onFormOk = async (values: any) => {
    const formType = formData.formType;
    if (formData.formType === PATCH) {
      values.api_id = formData.api_id;
    }
    return await apiDataView(POST, values).then((res) => {
      message.success(res.msg);
      setOpen(false);
      pageRef.current.tableRef.current.onRefresh(formType);
    });
  };
  const showForm = async (type: string, values: any = {}) => {
    if (type === PATCH) {
      await apiDataView(GET, values.id).then((res) => (values = res.results));
    }
    values['formType'] = type;
    setFormData({ ...values });
    setOpen(true);
  };
  return (
    <LimStandardPage
      pageRef={pageRef}
      reqService={apiDataView}
      tableProps={{
        columns: columns,
        headerTitle: `${project_name}接口库`,
        manualRequest: true,
      }}
      showForm={showForm}
      onFomrOk={onFormOk}
      diyForm={{
        open: open,
        Items: (
          <apiDataContext.Provider value={{ paramTypeCand, projectCand }}>
            <Form
              open={open}
              setOpen={setOpen}
              formData={formData}
              treeCaseModuleData={pageRef.current?.treeRef?.current?.treeData}
              formOk={onFormOk}
            />
          </apiDataContext.Provider>
        ),
      }}
      treeProps={{
        onFinishService: apiModuleView,
        treeService: treeApiModule,
        treeSpan: 4,
        extraParams: { project_id: project_id },
        extraSaveParams: { project: project_id },
      }}
    />
  );
};
export default React.memo(ApiData);
