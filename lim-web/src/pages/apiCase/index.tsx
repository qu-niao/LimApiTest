import React, { useState, useImperativeHandle, useEffect, useRef, useContext } from 'react';
import { Spin, message, Popconfirm, Space, Button, Popover, Tooltip } from 'antd';
import {
  PlayCircleOutlined,
  LoadingOutlined,
  ExpandOutlined,
  CompressOutlined,
  CloseOutlined,
  SettingTwoTone,
  DeleteOutlined,
  ExclamationCircleTwoTone,
} from '@ant-design/icons';
import { CaseForm, CaseSortForm, DeletedCaseForm, OverviewForm } from './form';
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
  setCasePosition,
  deleteSelectedCases,
} from '@/services/apiData';
import layoutContext from '@/limLayout/context';
import { getSelectRowLabel, scrollOffset, tableRowOnSelect, tableRowOnSelectAll } from '@/utils/utils';
import { LimStandardPage } from '@/components/limStandardPage';
import { runEnvirSelPopconfirm } from './components';
import Input from 'antd/lib/input';
import { tableComponents } from '@/components/ResizeTableHeader';


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
  const [sortOpen, setSortOpen] = useState<boolean>(false); //控制弹窗显示还是隐藏
  const [sortFormData, setSortFormData] = useState<any>({}); //传递给弹窗显示的数据
  const [deledCaseOpen, setDeledCaseOpen] = useState<boolean>(false); //控制弹窗显示还是隐藏
  const [treeCascaderCase, setTreeCascaderCase] = useState<any>([]);
  const [selectedOpen, setSelectedOpen] = useState(false);
  const [mergeCaseName, setMergeCaseName] = useState<string>('');
  const [currentMod, setCurrentMod] = useState<any>({});
  const [expandSerach, setExpandSerach] = useState<boolean>(false);

  const [loadingLabel, setLoadingLabel] = useState<string>('执行中...');
  const [cellWitdh, setCellWitdh] = useState<any>({ name: 200, updated: 130 });
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
  const onSortFormOk = async (values: any) => {
    return await setCasePosition(values).then((res) => {
      message.success(res.msg);
      setSortOpen(false);
      pageRef.current.tableRef.current.onRefresh(POST);
    });
  };
  //case_id可以是单个用例，也可以是多个用例（数组）
  const runCase = (caseId: any[] | null | number = null) => {
    setLoadingLabel('执行中...');
    setLoading(true);
    runApiCases({
      case: caseId ? [caseId] : selectedCases.map((item: any) => item.id),
      envir: envir,
    })
      .then((res) => {
        message.success(res.msg);
        pageRef.current?.tableRef?.current?.onRefresh();
      })
      .finally(() => setLoading(false));
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
    await copyCases({ case_id: caseId })
      .then((res) => {
        message.success(res.msg);
        pageRef.current?.tableRef?.current?.onRefresh();
        reqCascaderCaseTree();
      })
      .finally(() => {
        json[caseId] = false;
        setCopyLoadings({ ...json });
      });
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
        reqCascaderCaseTree();
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
          scroll: { y: `calc(100vh - ${scrollOffset(expandSerach, selectedCases)}px)`, x: '1350px' },
          columns: columns({ cellWitdhState: { cellWitdh, setCellWitdh } }),
          components: tableComponents,
          otherParams: { is_deleted: false },
          search: expandSerach
            ? {
              labelWidth: 'auto',
            }
            : false,
          headerTitle: (
            <div style={{ width: 700 }}>
              用例列表
              <Popover content="shift+Z或点右下角图标查看配置和参数池" placement="top">
                <ExclamationCircleTwoTone twoToneColor="#FAAD14" style={{ marginLeft: 3, fontSize: 18 }} />
              </Popover>
              <Button style={{ marginLeft: 10 }} onClick={() => setOverviewOpen(true)}>
                查看接口库
              </Button>
              <Button
                icon={<DeleteOutlined />}
                style={{ marginLeft: 10 }}
                onClick={() => setDeledCaseOpen(true)}
              >
                回收站
              </Button>
              <Button
                style={{ marginLeft: 8 }}
                icon={expandSerach ? <CompressOutlined /> : <ExpandOutlined />}
                onClick={() => setExpandSerach(!expandSerach)}
              >
                {`${expandSerach ? '隐藏' : '显示'}搜索框`}
              </Button>
              <Button
                style={{ marginLeft: 10 }}
                type="primary"
                onClick={() => {
                  if (!currentMod.id) {
                    message.warning('请先选择模块！');
                    return;
                  }
                  setSortFormData({ id: currentMod.id });
                  setSortOpen(true);
                }}
              >
                更改排序
              </Button>
            </div>
          ),
          manualRequest: true,
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
              <a key="report" onClick={() => window.open(`/apiReport?case=${record.id}`)}>
                查看报告
              </a>,
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
          tableAlertRender: ({ }) => (
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
              <Popconfirm
                title="您确定要删除吗？"
                okText="是"
                cancelText="否"
                onConfirm={() =>
                  deleteSelectedCases({ ids: selectedCases.map((item: any) => item.id) }).then((res: any) => {
                    message.success(res.msg);
                    pageRef.current?.tableRef?.current?.onRefresh();
                  })
                }
              >
                <Button danger>全部删除</Button>
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
        treeProps={{
          onFinishService: caseModuleView,
          treeService: treeCaseModule,
          treeSpan: 4,
          setCurrentMod: setCurrentMod,
        }}
      />
      <OverviewForm key="view" open={overviewOpen} onCancel={() => setOverviewOpen(false)} />
      <CaseSortForm open={sortOpen} formOk={onSortFormOk} setOpen={setSortOpen} formData={sortFormData} />
      <DeletedCaseForm
        open={deledCaseOpen}
        setOpen={setDeledCaseOpen}
        cancel={() => {
          setDeledCaseOpen(false);
          pageRef.current?.tableRef?.current?.onRefresh(POST);
          reqCascaderCaseTree();
        }}
      />
    </Spin>
  );
};
export default React.memo(ApiCase);
