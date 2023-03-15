import React, { useState, useEffect } from 'react';
import { Table, message, Skeleton, Tooltip, Row, Spin, Col, Card, Statistic, Divider } from 'antd';
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
    envirView(GET).then((res) => {
      setEnvirCand(res.reuslts);
    });
    getApiReport({ case_id }).then((res) => setRepData(res.results));
  }, []);
  return (
    <Row justify="center">
      <Col span={24}>
        {' '}
        <h1 style={{ textAlign: 'center', fontWeight: 'bold' }}>
          {reportData.name ? reportData.name + '测试报告' : '未找到对应报告'}
        </h1>
      </Col>
      <Row
        justify="center"
        style={{
     
          paddingTop: 15,
          width: '100%',
        }}
      >
        {STATIC_MAP.map((item) => (
          <Col span={4}>
            {loading ? (
              <Skeleton paragraph={{ rows: 1 }} />
            ) : (
              <Statistic title={item.name} value={`${reportData[item.valueKey]}${item.suffix}`} />
            )}
          </Col>
        ))}
      </Row>
    </Row>
  );
};
export default Report;
