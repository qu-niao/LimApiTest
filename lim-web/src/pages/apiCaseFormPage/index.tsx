import React, { useContext, useEffect, useRef, useState } from 'react';
import apiDataContext from '@/pages/apiData/context';
import { columns } from './columns';
import { LimStandardPage } from '@/components/limStandardPage';
import { caseView, treeCascaderModuleCase, treeCaseModule } from '@/services/apiData';
import { CaseForm } from '../apiCase/form';
import { GET, PATCH, POST } from '@/utils/constant';
import { ProForm } from '@ant-design/pro-components';
import { message } from 'antd';
import { paramType, envirView } from '@/services/conf';
import { projectView } from '@/services/project';

const ApiCaseFormPage = (props: any) => {
  const caseId = props.location.query?.caseId;
  const [open, setOpen] = useState<boolean>(false); //控制弹窗显示还是隐藏
  const [formData, setFormData] = useState<any>(null); //传递给弹窗显示的数据
  const [treeCascaderCase, setTreeCascaderCase] = useState<any>([]);
  const [paramTypeCand, setParamTypeCand] = useState([]);
  const [projectCand, setProjectCand] = useState([]);
  const [envirCand, setEnvirCand] = useState<any>([]);
  const [treeCaseModuleData, setTreeCaseModuleData] = useState([]);
  useEffect(() => {
    caseView(GET, caseId).then((res) => setFormData({ ...res.results, formType: PATCH }));
    paramType().then((res) => setParamTypeCand(res.results));
    projectView(GET).then((res) => setProjectCand(res.results));
    envirView(GET).then((res) => setEnvirCand(res.results));
    treeCaseModule().then((res) => setTreeCaseModuleData(res.results));
    reqCascaderCaseTree();
  }, []);
  const reqCascaderCaseTree = () => {
    treeCascaderModuleCase().then((res: any) => {
      setTreeCascaderCase(res.results);
    });
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
        window.close();
      }
    });
  };
  return formData ? (
    <apiDataContext.Provider value={{ paramTypeCand, projectCand, treeCascaderCase, reqCascaderCaseTree }}>
      <CaseForm
        open={true}
        setOpen={setOpen}
        formData={formData}
        treeCaseModuleData={treeCaseModuleData}
        formOk={onFormOk}
      />
    </apiDataContext.Provider>
  ) : (
    <></>
  );
};
export default React.memo(ApiCaseFormPage);
