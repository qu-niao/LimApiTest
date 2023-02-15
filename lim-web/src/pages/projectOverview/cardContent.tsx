import { Pie } from '@ant-design/plots';

export const Overview = ({ data }: any) => {
  const config = {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{value}个 {percentage}',
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };

  return (
    <>
      <span style={{ fontWeight: 'bold' }}>接口数量占比</span>
      <Pie {...config} style={{ height: 160 }} />
    </>
  );
};
