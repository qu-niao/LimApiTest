import React, { useState, useEffect } from 'react';
import { Table, message, Skeleton, Tooltip, Row, Spin, Col, Card, Button } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { envirView } from '@/services/conf';
import { GET } from '@/utils/constant';
import { getApiReport } from '@/services/apiData';
const Report = (props: any) => {
  const case_id = props.location.query?.case;
  const [envirCand, setEnvirCand] = useState<any[]>([]);
  const [reportData, setRepData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const STATIC_MAP = [
    {
      name: '项目总数',
      countKey: 'project_count',
      newCountKey: 'project_new_count',
      tip: '平台中创建的项目数量汇总',
    },
    {
      name: '接口总数',
      countKey: 'api_count',
      newCountKey: 'api_new_count',
      tip: '所有项目接口库中的接口数量汇总',
    },
    {
      name: '用例总数',
      countKey: 'case_count',
      newCountKey: 'case_new_count',
      tip: '平台中所有的接口用例数量汇总',
    },
  ];
  useEffect(() => {
    envirView(GET).then((res) => {
      setEnvirCand(res.reuslts);
    });
    getApiReport({ case_id }).then((res) => setRepData(res.results));
  }, []);
  return (
    <Row justify="center">
      <Col>
        {' '}
        <h1 style={{ textAlign: 'center', fontWeight: 'bold' }}>
          {reportData.name ? reportData.name + '测试报告' : '未找到对应报告'}
        </h1>
        <p>{`开始时间：${reportData.startTime || '0000-00-00'}`}</p>
      </Col>
      <Row
        style={{
          backgroundColor: '#F1F1F1',
          paddingTop: 15,
          width: '100%',
        }}
        gutter={[20, 20]}
      >
        {' '}
        {/* {STATIC_MAP.map((item) => (
          <Col span={8}>
            <Card style={{ backgroundColor: 'white', paddingBottom: 10 }}>
              {loading ? (
                <Skeleton paragraph={{ rows: 1 }} />
              ) : (
                <>
                  <div>
                    <span style={{ color: '#8C8C8C' }}>{item.name}</span>{' '}
                    <Tooltip title={item.tip}>
                      <InfoCircleOutlined
                        style={{ position: 'absolute', right: 16, fontSize: 16, color: '#8C8C8C' }}
                      />
                    </Tooltip>
                  </div>
                  <p style={{ fontSize: 36, marginBottom: 0, fontWeight: 'bold' }}>{data[item.countKey]}</p>
                  <span style={{ position: 'absolute', right: 16, fontSize: 10 }}>
                    较昨日新增：{data[item.newCountKey]}
                  </span>
                </>
              )}
            </Card>
          </Col>
        ))} */}
      </Row>
    </Row>
  );
};
export default Report;
