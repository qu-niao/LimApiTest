import React, { useState, useEffect } from 'react';
import { Card, Col, Skeleton, Button, Badge, Row } from 'antd';
import { Overview } from './cardContent';
import { projectOverView } from '@/services/project';
import ApiData from '../apiData';
import './index.css';
export const ProjectOverview = ({ type }: any) => {
  const [cardItems, setcardItems] = useState<any>([]);
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
                  <div>
                    <h3 style={{ fontWeight: 'bold', display: 'inline' }}>{item.name}</h3>
                    <Button style={{ float: 'right' }} onClick={() => setCurProjData(item)}>
                      查看接口库
                    </Button>
                  </div>
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
          {cardItems.length ? cardItems : <Skeleton paragraph={{ rows: 8 }} />}
        </Row>
      )}
    </>
  );
};
