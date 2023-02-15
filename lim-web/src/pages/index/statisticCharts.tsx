import { Pie, Column } from '@ant-design/plots';

export const PieChart = ({ data, content }: any) => {
  const config: any = {
    appendPadding: 10,
    data,
    angleField: 'count',
    colorField: 'name',
    radius: 1,
    innerRadius: 0.6,
    label: false,

    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        content: content,
      },
    },
  };
  return <Pie {...config} style={{ height: 'calc(100vh - 450px)' }} />;
};
export const ColumnChart = ({ data }: any) => {
  const config: any = {
    data,
    xField: 'name',
    yField: 'count',
    // color: 'blue',
    label: {
      // 可手动配置 label 数据标签位置
      position: 'middle',
      // 'top', 'bottom', 'middle',
      // 配置样式
      style: {
        fill: '#FFFFFF',
        size: 16,
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      type: {
        alias: '类别',
      },
      sales: {
        alias: '销售额',
      },
    },
  };
  return <Column {...config} style={{ height: 300 }} />;
};
