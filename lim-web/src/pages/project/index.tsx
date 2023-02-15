import React, { useRef } from 'react';
import { projectEnvirData, projectView } from '@/services/project';
import Form from './form';
import { columns } from './columns';
import { POST } from '@/utils/constant';
import { LimStandardPage } from '@/components/limStandardPage';
import EnvirTabs from './envirTabs';
const Project: React.FC = () => {
  const pageRef = useRef<any>(null);
  const showForm = async (type: string, values: any = {}) => {
    await projectEnvirData(type === POST ? {} : { id: values.id }).then((res) => {
      values['envir_data'] = res.results.map((item: any) => {
        const data = item.data;
        return {
          key: item.id,
          label: item.name,
          data: data,
          children: <EnvirTabs item={item} formRef={pageRef.current?.formRef} />,
        };
      });

      values['formType'] = type;
      pageRef.current.setFormData({ ...values });
      pageRef.current.setOpen(true);
    });
  };
  return (
    <LimStandardPage
      pageRef={pageRef}
      Form={Form}
      tableProps={{ columns, headerTitle: '项目列表' }}
      reqService={projectView}
      showForm={showForm}
    />
  );
};
export default React.memo(Project);
