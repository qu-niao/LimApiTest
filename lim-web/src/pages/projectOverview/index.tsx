import { useState, useEffect } from 'react';
import { Card, Col, Skeleton, Button, Row } from 'antd';
import { Overview } from './cardContent';
import { projectOverView } from '@/services/project';
import ApiData from '../apiData';
import './index.css';
export const ProjectOverview = ({ type }: any) => {
  const [cardItems, setcardItems] = useState<any>(null);
  const [curProjData, setCurProjData] = useState<any>(null);

  useEffect(() => {
    projectOverView({ type }).then((res) => {
      setcardItems(
        res.results.data.map((item: any, index: number) => {
          return (
            <Col span={8} key={index}>
              <Card
                key={index}
                title={
                  <Row gutter={8}>
                    <Col span={17}>
                      {' '}
                      <h3 style={{ fontWeight: 'bold' }} className="ellipsis">
                        {item.name}
                      </h3>
                    </Col>
                    <Col span={7}>
                      {' '}
                      <Button style={{ position: 'relative', right: 6 }} onClick={() => setCurProjData(item)}>
                        查看接口库
                      </Button>
                    </Col>
                  </Row>
                }
                bordered={false}
              >
                <Overview
                  data={[
                    { type: item.name, value: item.count },
                    { type: '其它项目', value: res.results.total_count - item.count },
                  ]}
                />
              </Card>
            </Col>
          );
        }),
      );
    });
  }, []);
  return (
    <>
      {curProjData ? (
        <>
          <p className="back" onClick={() => setCurProjData(null)}>
            {'<'} 返回上级
          </p>
          <ApiData project_data={curProjData} />
        </>
      ) : (
        <Row gutter={[16, 16]} style={{ minHeight: 300 }}>
          {cardItems ? cardItems : <Skeleton paragraph={{ rows: 8 }} />}
        </Row>
      )}
    </>
  );
};
