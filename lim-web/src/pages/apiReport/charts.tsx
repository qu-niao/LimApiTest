import {
  DISABLED_COLOR,
  FAILED_COLOR,
  REPORT_STEP_STATUS_COLOR,
  SKIP_COLOR,
  SUCCESS_COLOR,
} from '@/utils/constant';
import { Column, Pie } from '@ant-design/charts';

export const PieChart = ({ data, color = null }: any) => {
  const config: any = {
    appendPadding: 10,
    data,
    width: 300,
    height: 300,
    angleField: 'value',
    colorField: 'type',
    radius: 0.75,
    label: {
      type: 'spider',
      labelHeight: 28,
      content: '{name}\n{value}个',
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
  };
  if (color) {
    config.color = color;
  }

  return <Pie {...config} />;
};
export const ColumnChart = ({ data }: any) => {
  const config: any = {
    data: data.filter((item: any) => item.value),
    isStack: true,
    width: 200,
    height: 200,
    xField: 'name',
    yField: 'value',
    seriesField: 'type',
    color: ({ type }: any) => REPORT_STEP_STATUS_COLOR[type],
    label: {
      // 可手动配置 label 数据标签位置
      position: 'middle', // 'top', 'bottom', 'middle'
    },
    interactions: [
      {
        type: 'active-region',
        enable: false,
      },
    ],
    connectedArea: {
      style: (oldStyle: any, element: any) => {
        return {
          fill: 'rgba(0,0,0,0.25)',
          stroke: oldStyle.fill,
          lineWidth: 0.5,
        };
      },
    },
  };
  return <Column {...config} />;
};
