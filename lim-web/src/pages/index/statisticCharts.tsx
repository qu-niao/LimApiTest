import { Pie, Column } from '@ant-design/plots';

export const RingChart = ({ data, content, color = null }: any) => {
  const config: any = {
    appendPadding: 10,
    data,
    angleField: 'count',
    colorField: 'name',
    radius: 1,
    ...(color || {}),
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
          fontSize:24
        },
        content: content,
      },
    },
  };
  return <Pie {...config} style={{ height: 'calc(100vh - 420px)' }} />;
};
export const ColumnChart = ({ data }: any) => {
  const config: any = {
    data,
    xField: 'name',
    yField: 'count',

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
// export const PieChart = ({ data, content }: any) => {
//   const config = {
//     appendPadding: 10,
//     data,
//     angleField: 'count',
//     colorField: 'name',
//     color:''
//     radius: 0.9,
//     label: {
//       type: 'inner',
//       offset: '-30%',
//       content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
//       style: {
//         fontSize: 14,
//         textAlign: 'center',
//       },
//     },
//     interactions: [
//       {
//         type: 'element-active',
//       },
//     ],
//   };
//   return <Pie {...config} />;
// };
