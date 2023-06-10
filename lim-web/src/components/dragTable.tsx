import { MenuOutlined } from '@ant-design/icons';
export const dragHandleRender = (rowData: any, idx: any) => (
  <>
    <MenuOutlined style={{ cursor: 'grab' }} />
    &nbsp;{idx + 1}
  </>
);
