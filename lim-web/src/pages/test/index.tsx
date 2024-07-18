// import React from 'react';
// import { Radar } from '@ant-design/charts';
// import { DataSet } from '@antv/data-set';
// const TestCharts = () => {
//     const { DataView } = DataSet;
//     const dv = new DataView().source([
//         { item: '冲击篮筐', '科比': 76, '乔丹': 88.3 },
//         { item: '投篮', '科比': 90.2, '乔丹': 91 },
//         { item: '背身技术', '科比': 66.3, '乔丹': 77 },
//         { item: '传球', '科比': 88.5, '乔丹': 86.8 },
//         { item: '控球', '科比': 87.5, '乔丹': 90.7 },
//         { item: '稳定性', '科比': 91.5, '乔丹': 98 },
//         { item: '防守', '科比': 67.4, '乔丹': 82 },
//         { item: '篮板', '科比': 50, '乔丹': 56 },
//         { item: '运动能力', '科比': 84.9, '乔丹': 89.7 }
//     ]);
//     dv.transform({
//         type: 'fold',
//         fields: ['科比', '乔丹'], // 展开字段集
//         key: 'user', // key字段
//         value: 'score', // value字段
//     });

//     const config = {
//         data: dv.rows,
//         xField: 'item',
//         yField: 'score',
//         seriesField: 'user',
//         meta: {
//             score: {
//                 alias: '分数',
//                 min: 0,
//                 max: 100,
//             },
//         },
//         xAxis: {
//             line: null,
//             tickLine: null,
//             grid: {
//                 line: {
//                     style: {
//                         lineDash: null,
//                     },
//                 },
//             },
//         },
//         yAxis: {
//             line: null,
//             tickLine: null,
//             grid: {
//                 line: {
//                     type: 'line',
//                     style: {
//                         lineDash: null,
//                     },
//                 },
//             },
//         },
//         // 开启面积
//         area: {},
//         // 开启辅助点
//         point: {},
//     };

//     return <Radar style={{ height: '80%' }} {...config} />;

// }
// export default TestCharts;
