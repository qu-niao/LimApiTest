import React, { useRef, useEffect, useState } from 'react';
import { NotiUserParams } from '@/components/notiUserParams';
import { ProLayout, MenuDataItem } from '@ant-design/pro-components';
import { IconMaps } from '@/utils/menuIcon';
import { Link } from 'umi';
import { envirView, paramType } from '@/services/conf';
import { GET } from '@/utils/constant';
import layoutContext from './context';
import { Button, Popover, Tooltip } from 'antd';
import { SolutionOutlined, GithubOutlined } from '@ant-design/icons';
import RightContent from '@/components/RightContent';
import './index.css';
import { projectView } from '@/services/project';
const BasicLayout: React.FC<{}> = (props: any) => {
  const [envirCand, setEnvirCand] = useState<any>([]);
  const [paramTypeCand, setParamTypeCand] = useState([]);
  const [projectCand, setProjectCand] = useState([]);
  const [cfgOpen, setCfgOpen] = useState<boolean>(false);
  const { route } = props;
  const ref = useRef(null);
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
      logo={false}
      title="Lim 测试平台"
      pageTitleRender={false}
      headerContentRender={() => (
        <span>
          使用过程中遇到疑问？请访问项目仓库提出来：
          <Tooltip title="Gitee(国内用户推荐)">
            <Button
              icon={
                <svg
                  viewBox="0 0 1024 1024"
                  width="20"
                  height="20"
                  style={{ position: 'relative', top: 3.1 }}
                >
                  <path
                    d="M512 1024C230.4 1024 0 793.6 0 512S230.4 0 512 0s512 230.4 512 512-230.4 512-512 512z m259.2-569.6H480c-12.8 0-25.6 12.8-25.6 25.6v64c0 12.8 12.8 25.6 25.6 25.6h176c12.8 0 25.6 12.8 25.6 25.6v12.8c0 41.6-35.2 76.8-76.8 76.8h-240c-12.8 0-25.6-12.8-25.6-25.6V416c0-41.6 35.2-76.8 76.8-76.8h355.2c12.8 0 25.6-12.8 25.6-25.6v-64c0-12.8-12.8-25.6-25.6-25.6H416c-105.6 0-188.8 86.4-188.8 188.8V768c0 12.8 12.8 25.6 25.6 25.6h374.4c92.8 0 169.6-76.8 169.6-169.6v-144c0-12.8-12.8-25.6-25.6-25.6z"
                    fill="#2c2c2c"
                    p-id="1969"
                  ></path>
                </svg>
              }
              target="_blank"
              onClick={() => window.open('https://gitee.com/qu-niao/LessIsMore')}
            />
          </Tooltip>
          <Tooltip title="Github">
            <Button
              style={{ marginLeft: 8, position: 'relative', top: 2.6 }}
              icon={<GithubOutlined style={{ fontSize: 20 }} />}
              onClick={() => window.open('https://github.com/qu-niao/LimApiTest')}
            />
          </Tooltip>
        </span>
      )}
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
      <Popover content="点我查看配置和参数池" placement="topLeft">
        <Button
          className="user-cfg-but"
          type="primary"
          shape="circle"
          icon={<SolutionOutlined />}
          onClick={() => setCfgOpen(!cfgOpen)}
        />
      </Popover>
      <layoutContext.Provider value={{ layoutRef: ref }}> {props.children}</layoutContext.Provider>
    </ProLayout>
  );
};

export default BasicLayout;
