import React, { useRef, useEffect, useState } from 'react';
import { NotiUserParams } from '@/components/notiUserParams';
import { ProLayout, MenuDataItem } from '@ant-design/pro-components';
import { IconMaps } from '@/utils/menuIcon';
import { Link } from 'umi';
import { envirView, paramType } from '@/services/conf';
import { GET } from '@/utils/constant';
import layoutContext from './context';
import { Button, Tooltip, Popover } from 'antd';
import { SolutionOutlined } from '@ant-design/icons';
import RightContent from '@/components/RightContent';
import './index.css';
import { projectView } from '@/services/project';
const BasicLayout: React.FC<{}> = (props: any) => {
  const [envirCand, setEnvirCand] = useState<any>([]);
  const [paramTypeCand, setParamTypeCand] = useState([]);
  const [projectCand, setProjectCand] = useState([]);
  const [cfgOpen, setCfgOpen] = useState<boolean>(false);
  const { route } = props;
  const ref = useRef<any>(null);
  // 菜单
  const loopMenuItem = (menus: MenuDataItem[]): MenuDataItem[] =>
    menus.map(({ icon, children, ...item }) => ({
      ...item,
      icon: IconMaps[icon as string],
      children: children && loopMenuItem(children),
    }));
  useEffect(() => {
    envirView(GET).then((res) => {
      setEnvirCand(res.results);
    });
    paramType().then((res) => setParamTypeCand(res.results));
    projectView(GET).then((res) => setProjectCand(res.results));
  }, []);
  return (
    <ProLayout
      // logo={imgURL}
      //siderWidth={220}

      title="测试平台"
      pageTitleRender={false}
      headerContentRender={() => <span style={{ fontWeight: 'bold' }}>Less Is More</span>}
      layout="mix"
      rightContentRender={() => <RightContent />}
      menuDataRender={() => loopMenuItem(route.routes)}
      menuItemRender={(item, dom: any) => <Link to={item.path ?? '/'}>{dom}</Link>}
      contentStyle={{ paddingInline: 24, paddingBlock: 8 }}
    >
      <NotiUserParams
        envirCand={envirCand}
        paramTypeCand={paramTypeCand}
        projectCand={projectCand}
        layoutRef={ref}
        open={cfgOpen}
        setOpen={setCfgOpen}
      />

      <Tooltip title="查看用户配置/参数" placement="topLeft">
        <Button
          className="user-cfg-but"
          type="primary"
          shape="circle"
          icon={<SolutionOutlined />}
          onClick={() => setCfgOpen(!cfgOpen)}
        />
      </Tooltip>
      <layoutContext.Provider value={{ layoutRef: ref }}> {props.children}</layoutContext.Provider>
    </ProLayout>
  );
};

export default BasicLayout;
