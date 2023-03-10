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
  const { reqCascaderCaseTree, pageRef } = useContext(apiDataContext);
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
      tip={<span style={{ fontWeight: 'bold' }}>???????????????...</span>}
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
              ?????? {selectedSteps.length} ???
              <a style={{ marginInlineStart: 8 }} onClick={() => setSelectedSteps([])}>
                ????????????
              </a>
              <Popover
                content={getSelectRowLabel(selectedSteps, 'step_name')}
                title={
                  <p style={{ fontWeight: 'bold' }}>
                    ?????????(?????????????????????)
                    <CloseOutlined style={{ float: 'right' }} onClick={() => setSelectedOpen(false)} />
                  </p>
                }
                trigger="click"
                open={selectedOpen}
              >
                <a style={{ marginInlineStart: 8 }} onClick={() => setSelectedOpen(true)}>
                  ??????????????????
                </a>
              </Popover>
            </span>
            {/* <Button> ??????????????????</Button> */}
            <Popconfirm
              key="runcase"
              icon={false}
              title={
                <>
                  <Radio.Group defaultValue={mergeType} onChange={(e) => setMergeType(e.target.value)}>
                    <Radio value={API_CASE}>???????????????</Radio>
                    <Radio value={API_FOREACH}>??????????????????</Radio>
                  </Radio.Group>
                </>
              }
              onConfirm={() => mergeSteps()}
            >
              <Button> ???????????????????????????</Button>
            </Popconfirm>

            <Button onClick={() => changeSelectedStepEnabled(false)}> ???????????????</Button>
            <Button onClick={() => changeSelectedStepEnabled(true)}> ???????????????</Button>
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
        )}
        rowKey="id"
        {...props}
        pagination={false}
        dataSource={tableState.dataSource}
        dragSortKey="sort"
        onDragSortEnd={(newSource: any) => tableState.setDataSource([...newSource])}
      />
      <LimModalForm
        title="??????????????????"
        width={900}
        formOk={onFormOk}
        open={mergeCaseOpen}
        formItems={
          <>
            <DiyFormText
              rules={[
                { required: true, message: '??????????????????' },
                { type: 'string' },
                { max: 50, message: '??????50??????' },
              ]}
              label="????????????"
              placeholder="?????????????????????"
            />
            <ProFormCascader
              name="module_related"
              width="md"
              label="????????????"
              allowClear={false}
              rules={[{ required: true, message: '?????????????????????' }]}
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
