import React, { useContext, useState } from 'react';
import { Spin, Space, Popover, Popconfirm, message, Button } from 'antd';
import { LoadingOutlined, CloseOutlined } from '@ant-design/icons';
import { DragSortTable, ProFormCascader } from '@ant-design/pro-components';
import { getSelectRowLabel, tableRowOnSelect, tableRowOnSelectAll } from '@/utils/utils';
import Radio from 'antd/lib/radio';
import { API_CASE, API_FOREACH, POST, WAITING_STATUS } from '@/utils/constant';
import { showStepForm } from './func';
import { LimModalForm } from '@/components/limModalForm';
import { DiyFormText } from '@/components/diyAntdPomponent';
import apiDataContext from '@/pages/apiData/context';
import { caseView } from '@/services/apiData';
const SortTable: React.FC<any> = ({
  columns,
  stepFormState,
  controllerFormState,
  tableState,
  treeCaseModuleData,
  ...props
}) => {
  const [runLoading, setRunLoading] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number>(-1);
  const [selectedSteps, setSelectedSteps] = useState<any>([]);
  const [selectedOpen, setSelectedOpen] = useState(false);
  const [mergeType, setMergeType] = useState<any>(API_CASE);
  const [mergeCaseOpen, steMergeCaseOpen] = useState<boolean>(false);
  const changeSelectedStepEnabled = (enabled: boolean) => {
    const dataSource = [...tableState.dataSource];
    const selectedKeys = selectedSteps.map((item: any) => item.id);
    dataSource.forEach((item) => {
      if (selectedKeys.includes(item.id)) {
        item.enabled = enabled;
      }
    });
    tableState.setDataSource(dataSource);
  };
  const deleteSelectedSteps = () => {
    let dataSource = [...tableState.dataSource];
    const selectedKeys = selectedSteps.map((item: any) => item.id);
    dataSource = dataSource.filter((item) => !selectedKeys.includes(item.id));
    setSelectedSteps([]);
    tableState.setDataSource(dataSource);
  };
  const { reqCascaderCaseTree, treeCascaderCase, pageRef } = useContext(apiDataContext);
  const mergeSteps = () => {
    if (mergeType === API_FOREACH) {
      showStepForm(stepFormState, {
        formType: POST,
        rowIndex: -1,
        type: mergeType,
        params: { steps: selectedSteps },
      });
    } else {
      steMergeCaseOpen(true);
    }
  };
  const onFormOk = async (values: any) => {
    values.steps = selectedSteps;
    const module_related = values.module_related;
    values.module_id = module_related.slice(-1)[0];
    return await caseView(POST, values).then((res: any) => {
      message.success(res.msg);
      steMergeCaseOpen(false);
      reqCascaderCaseTree();
      const dataSouce = [...tableState.dataSource];
      dataSouce.push({
        type: API_CASE,
        step_name: values.name,
        enabled: true,
        status: WAITING_STATUS,
        controller_data: null,
        params: { case_related: [...module_related, res.results.case_id] },
      });
      tableState.setDataSource(dataSouce);
      pageRef?.current?.tableRef?.current?.onRefresh();
    });
  };
  return (
    <Spin
      tip={<span style={{ fontWeight: 'bold' }}>步骤执行中...</span>}
      indicator={<LoadingOutlined />}
      spinning={runLoading}
    >
      <DragSortTable
        bordered
        size="small"
        options={false}
        search={false}
        rowSelection={{
          selectedRowKeys: selectedSteps.map((item: any) => item.id),
          onSelect: (record: any, selected: boolean) => {
            if (!selectedSteps.length) {
              setSelectedOpen(true);
            }
            tableRowOnSelect(record, selected, selectedSteps, setSelectedSteps);
          },
          onSelectAll: (selected: boolean, _: any, changeRows: any) => {
            if (!selectedSteps.length) {
              setSelectedOpen(true);
            }
            tableRowOnSelectAll(selected, changeRows, selectedSteps, setSelectedSteps);
          },
        }}
        tableAlertRender={({}) => (
          <Space size={16}>
            <span>
              已选 {selectedSteps.length} 项
              <a style={{ marginInlineStart: 8 }} onClick={() => setSelectedSteps([])}>
                取消选择
              </a>
              <Popover
                content={getSelectRowLabel(selectedSteps, 'step_name')}
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
            {/* <Button> 执行选中步骤</Button> */}
            <Popconfirm
              key="runcase"
              icon={false}
              title={
                <>
                  <Radio.Group defaultValue={mergeType} onChange={(e) => setMergeType(e.target.value)}>
                    <Radio value={API_CASE}>合并为新用例</Radio>
                    <Radio value={API_FOREACH}>合并为循环器</Radio>
                  </Radio.Group>
                </>
              }
              onConfirm={() => mergeSteps()}
            >
              <Button> 合并选中项</Button>
            </Popconfirm>

            <Button onClick={() => changeSelectedStepEnabled(false)}> 禁用选中项</Button>
            <Button onClick={() => changeSelectedStepEnabled(true)}> 启用选中项</Button>
            <Button danger onClick={() => deleteSelectedSteps()}>
              {' '}
              删除选中项
            </Button>
          </Space>
        )}
        tableAlertOptionRender={false}
        columns={columns(
          stepFormState,
          controllerFormState,
          tableState,
          setRunLoading,
          hoverIndex,
          setHoverIndex,
          treeCascaderCase,
        )}
        rowKey="id"
        {...props}
        pagination={false}
        dataSource={tableState.dataSource}
        dragSortKey="sort"
        onDragSortEnd={(newSource: any) => tableState.setDataSource([...newSource])}
      />
      <LimModalForm
        title="编辑合并用例"
        width={900}
        formOk={onFormOk}
        open={mergeCaseOpen}
        setOpen={steMergeCaseOpen}
        formItems={
          <>
            <DiyFormText
              rules={[
                { required: true, message: '用例名称必填' },
                { type: 'string' },
                { max: 50, message: '最多50个字' },
              ]}
              label="用例名称"
              placeholder="请输入用例名称"
            />
            <ProFormCascader
              name="module_related"
              width="md"
              label="所属模块"
              allowClear={false}
              rules={[{ required: true, message: '所属模块必选！' }]}
              fieldProps={{
                changeOnSelect: true,
                expandTrigger: 'hover',
                options: treeCaseModuleData,
                fieldNames: { label: 'name', children: 'children', value: 'id' },
              }}
            />
          </>
        }
      />
    </Spin>
  );
};
export default React.memo(SortTable);
