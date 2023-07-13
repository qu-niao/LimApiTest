import { Resizable } from 'react-resizable';
import './index.css';

// 调整table表头
export const ResizeableHeader = (props: any) => {
  const { onResize, width, ...restProps } = props;
  if (!width) {
    return <th {...restProps} />;
  }
  return (
    <Resizable width={width} height={0} onResize={onResize} draggableOpts={{ enableUserSelectHack: false }}>
      <th {...restProps} />
    </Resizable>
  );
};

// 定义头部组件
export const tableComponents = {
  header: {
    cell: ResizeableHeader,
  },
};
export class CellResize {
  cellWitdh: any;
  setCellWitdh: any;
  constructor(cellWitdhState: any) {
    this.cellWitdh = cellWitdhState.cellWitdh;
    this.setCellWitdh = cellWitdhState.setCellWitdh;
  }
  cellResizeWitdh = (column: any, colName: string) => {
    return {
      width: column.width,
      onResize: (_: any, { size }: any) => {
        this.setCellWitdh({ ...this.cellWitdh, [`${colName}`]: size.width });
      },
    };
  };
}
