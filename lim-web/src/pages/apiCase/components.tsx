import { Popconfirm, Radio } from 'antd';
import { SettingTwoTone } from '@ant-design/icons';
export const runEnvirSelPopconfirm = (
  envirCand: any,
  envir: number,
  setEnvir: Function,
  runCase: Function,
  renderNode: any,
  caseId: number | null = null,
) => {
  return (
    <Popconfirm
      key="runcase"
      icon={<SettingTwoTone style={{ position: 'absolute', top: 20, left: 5 }} twoToneColor="#FAAD14" />}
      title={
        <>
          <p>选择执行环境</p>
          <Radio.Group defaultValue={envir} onChange={(e) => setEnvir(e.target.value)}>
            {envirCand.map((item: any) => (
              <Radio value={item.id} key={item.id}>
                {item.name}
              </Radio>
            ))}
          </Radio.Group>
        </>
      }
      onConfirm={() => runCase(caseId)}
    >
      {renderNode}
    </Popconfirm>
  );
};
