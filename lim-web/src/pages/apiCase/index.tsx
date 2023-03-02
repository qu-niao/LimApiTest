import React, { useState, useImperativeHandle, useEffect, useRef, useContext } from 'react';
import { Spin, message, Popconfirm, Space, Button, Popover } from 'antd';
import { PlayCircleOutlined, LoadingOutlined, CloseOutlined, SettingTwoTone } from '@ant-design/icons';
import { CaseForm, OverviewForm } from './form';
import { columns } from './columns';
import apiDataContext from '@/pages/apiData/context';
import { paramType, envirView } from '@/services/conf';
import { DELETE_CONFIRM_TIP, GET, PATCH, POST } from '@/utils/constant';
import { projectView } from '@/services/project';
import {
  caseModuleView,
  treeCaseModule,
  caseView,
  runApiCases,
  treeCascaderModuleCase,
  copyCases,
  mergeCases,
} from '@/services/apiData';
import layoutContext from '@/limLayout/context';
import { getSelectRowLabel, tableRowOnSelect, tableRowOnSelectAll } from '@/utils/utils';
import { LimStandardPage } from '@/components/limStandardPage';
import { runEnvirSelPopconfirm } from './components';
import Input from 'antd/lib/input';

const ApiCase: React.FC = () => {
  const { layoutRef } = useContext(layoutContext);
  const pageRef = useRef<any>();
  const [paramTypeCand, setParamTypeCand] = useState([]);
  const [projectCand, setProjectCand] = useState([]);
  const [overviewOpen, setOverviewOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [copyLoadings, setCopyLoadings] = useState<any>({});
  const [selectedCases, setSelectedCases] = useState<any>([]);
  const [envir, setEnvir] = useState<any>(1);
  const [envirCand, setEnvirCand] = useState<any>([]);
  const [open, setOpen] = useState<boolean>(false); //控制弹窗显示还是隐藏
  const [formData, setFormData] = useState<any>({}); //传递给弹窗显示的数据
  const [treeCascaderCase, setTreeCascaderCase] = useState<any>([]);
  const [selectedOpen, setSelectedOpen] = useState(false);
  const [mergeCaseName, setMergeCaseName] = useState<string>('');
  const [currentMod, setCurrentMod] = useState<any>({});
  const [loadingLabel, setLoadingLabel] = useState<string>('执行中...');
  useEffect(() => {
    paramType().then((res) => setParamTypeCand(res.results));
    projectView(GET).then((res) => setProjectCand(res.results));
    envirView(GET).then((res) => setEnvirCand(res.results));
    reqCascaderCaseTree();
  }, []);
  useImperativeHandle(layoutRef, () => ({
    tableRef: pageRef.current?.tableRef,
  }));
  const showForm = async (type: string, values: any = {}) => {
    if (type == PATCH) {
      setLoadingLabel('弹窗数据加载中...');
      setLoading(true);
      await caseView(GET, values.id).then((res) => {
        values = res.results;
        setLoading(false);
      });
    } else {
      values['module_related'] = currentMod.module_related || [];
    }
    values['formType'] = type;
    setFormData({ ...values });
    setOpen(true);
  };
  const onFormOk = async (values: any, closeForm: boolean = true) => {
    const formType = formData.formType;
    if (formType === PATCH) {
      values.id = formData.id;
    }
    values.module_id = values.module_related.slice(-1)[0];
    return await caseView(POST, values).then((res: any) => {
      message.success('保存成功！');
      if (closeForm) {
        setOpen(false);
      }
      reqCascaderCaseTree();
      pageRef.current.tableRef.current.onRefresh(formType);
    });
  };
  //case_id可以是单个用例，也可以是多个用例（数组）
  const runCase = (caseId: any[] | null | number = null) => {
    setLoadingLabel('执行中...');
    setLoading(true);
    runApiCases({
      case: caseId ? [caseId] : selectedCases.map((item: any) => item.id),
      envir: envir,
    }).then(
      (res) => {
        message.success(res.msg);
        setLoading(false);
        pageRef.current?.tableRef?.current?.onRefresh();
      },
      () => setLoading(false),
    );
  };
  const reqCascaderCaseTree = () => {
    treeCascaderModuleCase().then((res: any) => {
      setTreeCascaderCase(res.results);
    });
  };
  const copyCasesFunc = async (caseId: any) => {
    let json = {};
    json[caseId] = true;
    setCopyLoadings(json);
    await copyCases({ case_id: caseId }).then(
      (res) => {
        message.success(res.msg);
        json[caseId] = false;
        setCopyLoadings({ ...json });
        pageRef.current?.tableRef?.current?.onRefresh();
      },
      () => {
        json[caseId] = false;
        setCopyLoadings({ ...json });
      },
    );
  };
  const mergeCasesFunc = () => {
    if (!mergeCaseName) {
      message.error('用例名称不能为空！');
      return false;
    } else {
      mergeCases({
        name: mergeCaseName,
        case_ids: selectedCases.map((item: any) => item.id),
        module_id: currentMod.id,
      }).then((res) => {
        message.success(res.msg);
        pageRef.current?.tableRef?.current?.onRefresh();
      });
    }
  };

  return (
    <Spin
      tip={<span style={{ fontWeight: 'bold' }}>{loadingLabel}</span>}
      indicator={<LoadingOutlined />}
      spinning={loading}
    >
      <LimStandardPage
        pageRef={pageRef}
        showForm={showForm}
        reqService={caseView}
        tableProps={{
          size: 'small',
          scroll: { y: `calc(100vh - ${selectedCases.length ? '430' : '360'}px)`, x: '1350px' },
          columns: columns,
          search: {
            labelWidth: 'auto',
          },
          headerTitle: (
            <>
              接口用例列表
              <a style={{ marginLeft: 10 }} onClick={() => setOverviewOpen(true)}>
                查看接口库
              </a>
            </>
          ),
          manualRequest: true,
          optionRefresh: [envir, copyLoadings, mergeCaseName, currentMod],
          optionRender: (dom: any, record: any) => {
            return [
              runEnvirSelPopconfirm(
                envirCand,
                envir,
                setEnvir,
                runCase,
                <a key="run">
                  <PlayCircleOutlined />
                </a>,
                record.id,
              ),
              dom.update,
              <Button
                key="copy"
                type="link"
                style={{ padding: 0 }}
                loading={copyLoadings[record.id]}
                onClick={() => copyCasesFunc(record.id)}
              >
                复制
              </Button>,
              <a onClick={() => message.warning('实现中... ')}>查看报告</a>,
              <Popconfirm
                key="delete"
                title={DELETE_CONFIRM_TIP}
                onConfirm={async () => {
                  await pageRef.current?.tableRef.current?.comDeleteData(caseView, record.id);
                  reqCascaderCaseTree();
                }}
              >
                <a> 删除 </a>
              </Popconfirm>,
            ];
          },
          rowSelection: {
            selectedRowKeys: selectedCases.map((item: any) => item.id),
            onSelect: (record: any, selected: boolean) => {
              if (!selectedCases.length) {
                setSelectedOpen(true);
              }
              tableRowOnSelect(record, selected, selectedCases, setSelectedCases);
            },
            onSelectAll: (selected: boolean, _: any, changeRows: any) => {
              if (!selectedCases.length) {
                setSelectedOpen(true);
              }
              tableRowOnSelectAll(selected, changeRows, selectedCases, setSelectedCases);
            },
          },
          tableAlertRender: ({}) => (
            <Space size={16}>
              <span>
                已选 {selectedCases.length} 项
                <a style={{ marginInlineStart: 8 }} onClick={() => setSelectedCases([])}>
                  取消选择
                </a>
                <Popover
                  content={getSelectRowLabel(selectedCases)}
                  title={
                    <p style={{ fontWeight: 'bold' }}>
                      选中项(按选中顺序排列)
                      <CloseOutlined style={{ float: 'right' }} onClick={() => setSelectedOpen(false)} />
                    </p>
                  }
                  trigger="click"
                  open={selectedOpen}
                >
                  <a style={{ marginInlineStart: 8 }} onClick={() => setSelectedOpen(true)}>
                    查看已选中项
                  </a>
                </Popover>
              </span>
              {runEnvirSelPopconfirm(envirCand, envir, setEnvir, runCase, <Button> 执行选中用例</Button>)}
              <Popconfirm
                key="mergeplan"
                icon={<SettingTwoTone twoToneColor="#FAAD14" />}
                title={
                  <>
                    <p>输入新用例名称</p>
                    <Input onChange={(e) => setMergeCaseName(e.target.value)} />
                  </>
                }
                onConfirm={() => mergeCasesFunc()}
              >
                <Button> 将选中合并为新用例</Button>
              </Popconfirm>
            </Space>
          ),
          tableAlertOptionRender: false,
        }}
        diyForm={{
          open: open,
          Items: (
            <apiDataContext.Provider
              value={{ paramTypeCand, projectCand, treeCascaderCase, reqCascaderCaseTree, pageRef }} //pageRef在DragTable中会用到
            >
              <CaseForm
                open={open}
                setOpen={setOpen}
                formData={formData}
                treeCaseModuleData={pageRef.current?.treeRef?.current?.treeData}
                formOk={onFormOk}
              />
            </apiDataContext.Provider>
          ),
        }}
        ExtraItems={[<OverviewForm key="view" open={overviewOpen} onCancel={() => setOverviewOpen(false)} />]}
        treeProps={{
          onFinishService: caseModuleView,
          treeService: treeCaseModule,
          treeSpan: 4,
          setCurrentMod: setCurrentMod,
        }}
      />
    </Spin>
  );
};
export default React.memo(ApiCase);
