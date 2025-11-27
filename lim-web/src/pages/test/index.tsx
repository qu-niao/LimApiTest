import React, { useEffect, useRef, useState } from 'react';
import { ProFormText, ProFormRadio, ProFormTextArea, ProFormDatePicker, ProFormList, ProFormGroup, EditableProTable } from '@ant-design/pro-components';
import { POST } from '@/utils/constant';
import { LimModalForm } from '@/components/limModalForm';
import { Collapse, Grid } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';


const { Panel } = Collapse;
let i = 0;
const Form: React.FC<any> = ({ formData, ...props }) => {

  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() => []);
  const editorFormRef = useRef<any>();
  const formRef = useRef<any>();

  const columns: any[] = [
    {
      title: '表头名称',
      dataIndex: 'name',
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
      width: 200,
    },

    {
      title: '操作',
      valueType: 'option',
      width: 100,
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id, record);
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => {
            const tableDataSource = formRef.current?.getFieldValue('fields');
            console.log('tab', tableDataSource)
            formRef.current?.setFieldsValue({
              fields: tableDataSource.filter((item) => item.id !== record.id),
            });
          }}
        >
          删除
        </a>,
      ],
    },
  ];
  console.log('ff', formRef.current?.getFieldValue('fields'))

  return (
    <LimModalForm
      title={formData.formType === POST ? '创建项目' : '修改项目'}
      formRef={formRef}
      initialValues={{
        project_name: formData.name || null,
        remark: formData.remark || null,
        is_active: formData.is_active || true,

        fields: formData.fields || [],
      }}
      {...props}
      formItems={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          <ProFormGroup>
            <ProFormText
              width="md"
              name="name"
              rules={[
                { required: true, message: '项目名称必填' },
                { type: 'string' },
                { max: 50, message: '最多50个字' },
              ]}
              label="项目名称"
              placeholder="请输入项目名称"
            />

            <ProFormRadio.Group
              name="is_active"
              label="项目状态"
              options={[
                { label: '启用', value: true },
                { label: '禁用', value: false },
              ]}
            />
          </ProFormGroup>


          {/* 动态表格区域 */}
          <div style={{
            padding: '0px 16px',
            border: '1px solid #f0f0f0',
            borderRadius: 8,
            backgroundColor: '#fafafa'
          }}>

            <div style={{
              maxHeight: 300,
              overflowY: 'auto',
              paddingRight: 8
            }}>
              <EditableProTable<any>
                rowKey="id"
                // scroll={{
                //   x: 960,
                // }}
                editableFormRef={editorFormRef}
                headerTitle="字段配置"
                maxLength={5}
                name="fields"
                controlled
                recordCreatorProps={
                  {
                    position: 'bottom',
                    record: () => ({ id: (Math.random() * 1000000).toFixed(0) }),
                  }
                }

                columns={columns}
                editable={{
                  type: 'multiple',
                  editableKeys,
                  onChange: setEditableRowKeys,
                  actionRender: (row, config, defaultDom) => {
                    return [
                      defaultDom.save,
                      defaultDom.delete,
                      defaultDom.cancel,
                      <a
                        key="set"
                        onClick={() => {
                          console.log(config.index);
                          i++;
                          editorFormRef.current?.setRowData?.(config.index!, {
                            title: '动态设置的title' + i,
                          });
                        }}
                      >
                        动态设置此项
                      </a>,
                    ];
                  },
                }}
              />
            </div>
          </div>

          {/* 备注区域 */}

          <Collapse
            bordered={false}
            ghost
            defaultActiveKey={['1']}
            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
          >
            <Panel
              header={<span >备注信息</span>}
              key="1"
            >
              <ProFormTextArea
                name="remark"
                rules={[{ type: 'string' }]}
                placeholder="请输入备注信息"
                fieldProps={{ autoSize: { minRows: 3 } }}
              />
            </Panel>
          </Collapse>
        </div>

      }
    />
  );
};

export default React.memo(Form);