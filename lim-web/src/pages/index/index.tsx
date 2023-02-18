import { getIndexStatistics } from '@/services/project';
import { Spin, Card, Layout, Col, Row, Skeleton, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { PieChart } from './statisticCharts';
import { InfoCircleOutlined } from '@ant-design/icons';
const { Footer } = Layout;

const Index: React.FC = () => {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    getIndexStatistics().then((res) => {
      setData(res.results);
      setLoading(false);
    });
  }, []);
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
  return (
    <>
      <Row gutter={16} style={{ paddingTop: 8 }}>
        <Col span={18}>
          <Row gutter={16}>
            {STATIC_MAP.map((item) => (
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
                      <p style={{ fontSize: 36, marginBottom: 0, fontWeight: 'bold' }}>
                        {data[item.countKey]}
                      </p>
                      <span style={{ position: 'absolute', right: 16, fontSize: 10 }}>
                        较昨日新增：{data[item.newCountKey]}
                      </span>
                    </>
                  )}
                </Card>
              </Col>
            ))}
          </Row>
          <Row gutter={24} style={{ paddingTop: 16 }}>
            <Col span={12}>
              <Card title={<p style={{ fontWeight: 'bold' }}>各项目接口数量统计</p>} bordered={false}>
                {loading ? (
                  <Skeleton paragraph={{ rows: 7 }} />
                ) : (
                  <PieChart data={data.api_data || []} content="接口" />
                )}
              </Card>
            </Col>
            <Col span={12}>
              <Card title={<p style={{ fontWeight: 'bold' }}>各用户用例数量统计</p>} bordered={false}>
                {loading ? (
                  <Skeleton paragraph={{ rows: 7 }} />
                ) : (
                  <PieChart data={data.case_data || []} content="用例" />
                )}
              </Card>
            </Col>
          </Row>
        </Col>
        <Col span={6}>
          {' '}
          <Card
            title={<p style={{ fontWeight: 'bold' }}>Lim测试平台 简介</p>}
            bordered={false}
            style={{ height: '100%' }}
          ></Card>
        </Col>
      </Row>
      <Footer style={{ textAlign: 'center', backgroundColor: '#F5F5F5' }}>
        Lim测试平台 ©2023 作者：
        
        <a href="https://quniao.blog.csdn.net/">
          <img
            style={{ marginBottom: 4 }}
            src="https://img.shields.io/badge/%E6%9B%B2%E9%B8%9F-CSDN-FC5531"
            alt="曲鸟-CSDN"
          />
        </a>
        <a href="https://www.zhihu.com/people/qing-ci-64-16">
          <img
            style={{ marginBottom: 4, marginLeft: 3 }}
            src="https://img.shields.io/badge/%E6%9B%B2%E9%B8%9F-%E7%9F%A5%E4%B9%8E-blue"
            alt="曲鸟-知乎"
          />
        </a>
      </Footer>
    </>
  );
};

export default Index;
