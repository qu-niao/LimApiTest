import { getIndexStatistics } from '@/services/project';
import { Empty, Card, Layout, Col, Row, Skeleton, Tooltip, Divider } from 'antd';
import React, { useEffect, useState } from 'react';
import { UnorderedListOutlined } from '@ant-design/icons';
import { RingChart } from './statisticCharts';
import { InfoCircleOutlined } from '@ant-design/icons';
const { Footer } = Layout;
const EmptyComponents = () => (
  <div
    style={{
      height: 'calc(100vh - 430px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {' '}
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
  </div>
);
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
              <Card
                title={
                  <p style={{ fontWeight: 'bold' }}>
                    各项目接口数量统计{' '}
                    <UnorderedListOutlined
                      style={{ position: 'absolute', right: 24, top: 20, fontSize: 24 }}
                    />
                  </p>
                }
                bordered={false}
              >
                {loading ? (
                  <Skeleton paragraph={{ rows: 7 }} />
                ) : data.api_data.length ? (
                  <RingChart
                    data={data.api_data}
                    content="接口统计"
                    color={{
                      color: ['#657798', '#F6C022', '#62DAAB', '#7666F9', '#74CBED', '#6395F9'],
                    }}
                  />
                ) : (
                  <EmptyComponents />
                )}
              </Card>
            </Col>
            <Col span={12}>
              <Card
                title={
                  <p style={{ fontWeight: 'bold' }}>
                    各用户用例数量统计{' '}
                    <UnorderedListOutlined
                      style={{ position: 'absolute', right: 24, top: 20, fontSize: 24 }}
                    />
                  </p>
                }
                bordered={false}
              >
                {loading ? (
                  <Skeleton paragraph={{ rows: 7 }} />
                ) : data.case_data.length ? (
                  <RingChart data={data.case_data} content="用例统计" />
                ) : (
                  <EmptyComponents />
                )}
              </Card>
            </Col>
          </Row>
        </Col>
        <Col span={6}>
          {' '}
          <Card bordered={false} style={{ height: '100%' }}>
            <div style={{ maxHeight: 'calc(100vh - 370px)', overflowY: 'auto' }}>
              <h3 style={{ fontWeight: 'bold' }}>Lim测试平台 简介</h3>
              Lim是Less is More(少即是多)的缩写，正如它的名字我们希望在开展接口测试时能够“四两拨千斤”！让用户操作更少但开展建设的效率更高。
              因此我们做了许多交互细节上的优化和创新以及一些大胆的设计，比如：取消了局部变量、前后置计划、抛弃“先接口后用例”的传统建设思想，甚至还取消了“登录”！
              <br />
              你是否会疑问：这群Diao毛去掉了这些还如何高效的开展接口测试？
              那还在等什么？赶快进入Lim的世界，看看Lim是怎么通过另一种方式让接口测试变得简单且高效的吧！
            </div>
            <Divider />
            <p style={{ fontWeight: 'bold', marginBottom: 3 }}>
              三分钟上手（必看！）：
              <a
                style={{ fontWeight: 'bold' }}
                target="_blank"
                href="https://thzfhzdqvc.feishu.cn/docx/FgCpdAEy2oDjP4xJOkFcIjyJnnf"
              >
                点我访问
              </a>
            </p>
            <p style={{ marginBottom: 3 }}>
              答疑、定制化开发+微信：<span style={{ fontWeight: 'bold' }}>qu-niao</span>
            </p>
            作者主页：
            <a target="_blank" href="https://quniao.blog.csdn.net/">
              <img
                style={{ marginBottom: 4 }}
                src="https://img.shields.io/badge/%E6%9B%B2%E9%B8%9F-CSDN-FC5531"
                alt="曲鸟-CSDN"
              />
            </a>
            <a target="_blank" href="https://www.zhihu.com/people/qing-ci-64-16">
              <img
                style={{ marginBottom: 4, marginLeft: 3 }}
                src="https://img.shields.io/badge/%E6%9B%B2%E9%B8%9F-%E7%9F%A5%E4%B9%8E-blue"
                alt="曲鸟-知乎"
              />
            </a>
          </Card>
        </Col>
      </Row>
      <p style={{ textAlign: 'center', backgroundColor: '#F5F5F5', marginTop: 10 }}>
        Lim接口测试平台1.0 ©2023 曲鸟团队出品
      </p>
    </>
  );
};

export default Index;
