import React, { useState, useEffect } from 'react';
import { Table, message, Skeleton, Tooltip, Row, Spin, Col, Card, Statistic, Divider } from 'antd';
import apiDataContext from '@/pages/apiData/context';
import { envirView, paramType } from '@/services/conf';
import {
  API_CASE,
  DISABLED_COLOR,
  FAILED_COLOR,
  GET,
  POST,
  SKIP_COLOR,
  SUCCESS_COLOR,
} from '@/utils/constant';
import { caseView, getApiReport, treeCascaderModuleCase, treeCaseModule } from '@/services/apiData';
import './index.css';
import { ColumnChart, PieChart } from './charts';
import { stepColumns } from './columns';
import { StepForm } from '../apiCase/stepForm';
import { projectView } from '@/services/project';
const Report = (props: any) => {
  const case_id = props.location.query?.case;
  const [envirCand, setEnvirCand] = useState<any[]>([]);
  const [paramTypeCand, setParamTypeCand] = useState<any[]>([]);
  const [projectCand, setProjectCand] = useState<any[]>([]);
  const [reportData, setRepData] = useState<any>({});
  const [treeCascaderCase, setTreeCascaderCase] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [stepOpen, setStepOpen] = useState<boolean>(false);
  const [stepFormData, setStepFormData] = useState<any>({}); //传递给弹窗显示的数据
  const [formWidth, setFormWidth] = useState<number>(1000);
  const stepFormState = {
    open: stepOpen,
    setOpen: setStepOpen,
    formData: stepFormData,
    setFormData: setStepFormData,
    formWidth,
    setFormWidth,
  };
  const STATIC_MAP = [
    {
      name: '开始时间',
      valueKey: 'start_time',
      suffix: '',
    },
    {
      name: '执行环境',
      valueKey: 'envir_name',
      suffix: '',
    },

    {
      name: '总耗时',
      valueKey: 'spend_time',
      suffix: 'S',
    },
    {
      name: '用例总数',
      valueKey: 'case_count',
      suffix: '个',
    },
    {
      name: '步骤总数',
      valueKey: 'case_count',

      suffix: '个',
    },
  ];
  useEffect(() => {
    envirView(GET).then((res) => setEnvirCand(res.reuslts));
    paramType().then((res) => setParamTypeCand(res.results));
    projectView(GET).then((res) => setProjectCand(res.results));
    reqCascaderCaseTree();
    setLoading(true);
    getApiReport({ case_id }).then((res) => {
      setRepData(res.results);
      setLoading(false);
    });
  }, []);
  const reqCascaderCaseTree = () => {
    treeCascaderModuleCase().then((res: any) => {
      setTreeCascaderCase(res.results);
    });
  };
  const showStepModal = async (values: any) => {
    setStepFormData(values);
    setStepOpen(true);
  };

  const expandedRowRender = (record: any) => {
    const data = record.results;
    return (
      <Table
        columns={stepColumns(showStepModal)}
        rowKey="id"
        bordered
        dataSource={data}
        expandable={{
          expandedRowRender,
          rowExpandable: (record) => record.type === API_CASE && typeof record.results === 'object',
        }}
        pagination={false}
      />
    );
  };

  return loading ? (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Spin tip={<span style={{ fontWeight: 'bold' }}>报告加载中...</span>} />
    </div>
  ) : (
    <Row justify="center">
      <Col span={20}>
        {' '}
        <h1 style={{ textAlign: 'center', fontWeight: 'bold' }}>
          {reportData.name ? reportData.name + '测试报告' : '未找到对应报告'}
        </h1>
        <div className="statistics">
          {STATIC_MAP.map((item) =>
            loading ? (
              <Skeleton paragraph={{ rows: 1 }} />
            ) : (
              <Statistic
                key={item.name}
                title={item.name}
                value={`${reportData[item.valueKey]}${item.suffix}`}
              />
            ),
          )}
        </div>
   
        <Row style={{ backgroundColor: '#f1f1f1', paddingTop: 10 }} gutter={[10, 10]}>
          <Col span={12}>
            {' '}
            <Card title={<h3 style={{ fontWeight: 'bold' }}>步骤执行状态统计</h3>}>
              <PieChart
                data={reportData.step_count?.sp_status || []}
                color={[SUCCESS_COLOR, FAILED_COLOR, SKIP_COLOR, DISABLED_COLOR]}
              />
            </Card>
          </Col>
          <Col span={12}>
            {' '}
            <Card title={<h3 style={{ fontWeight: 'bold' }}>步骤类型统计</h3>}>
              <PieChart data={reportData.step_count?.sp_type || []} />
            </Card>
          </Col>
          <Col className="wrapper" key={6} span={24}>
            <Card title={<h3 style={{ fontWeight: 'bold' }}>接口计划步骤情况统计</h3>}>
              <ColumnChart data={reportData.cases || []} />
            </Card>
          </Col>
          <Col span={24}>
            <Table
              key={reportData.steps || []}
              scroll={{ y: 500 }}
              bordered
              pagination={false}
              title={() => <h2 style={{ fontWeight: 'bold' }}>步骤详情</h2>}
              columns={stepColumns(showStepModal)}
              rowKey="id"
              expandable={{
                expandedRowRender,
                rowExpandable: (record) => record.type === API_CASE && typeof record.results === 'object',
              }}
              dataSource={reportData.steps || []}
              footer={() => ''}
            />
          </Col>
        </Row>
        <apiDataContext.Provider
          value={{ paramTypeCand, projectCand, treeCascaderCase, reqCascaderCaseTree }}
        >
          <StepForm
            stepFormState={stepFormState}
            submitter={false}
            extraDrawerProps={{ maskClosable: true }}
          />
        </apiDataContext.Provider>
      </Col>
    </Row>
  );
};
export default Report;
