import React, { useState, useEffect } from 'react';
import { Table, message, Row, Spin, Col, Card, Button } from 'antd';
import { envirView } from '@/services/conf';
import { GET } from '@/utils/constant';
import { getApiReport } from '@/services/apiData';
const Report = (props: any) => {
  const case_id = props.location.query?.case;
  const [envirCand, setEnvirCand] = useState<any[]>([]);
  const [reportData, setRepData] = useState<any>({});
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
      </Col>
    </Row>
  );
};
export default Report;
