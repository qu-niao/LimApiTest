import type {
    EditableFormInstance,
    ProColumns,
    ProFormInstance
  } from "@ant-design/pro-components";
  import {
    EditableProTable,
    ProForm,
    ProFormTextArea,
    ProFormRadio
  } from "@ant-design/pro-components";
  import React, { useRef, useState } from "react";
  
  type DataSourceType = {
    id: React.Key;
    title?: string;
    decs?: string;
    state?: string;
    created_at?: string;
    update_at?: string;
    children?: DataSourceType[];
  };
  
  const defaultData: DataSourceType[] = [
    {
      id: 624748504,
      title: "活动名称一",
      decs: "这个活动真好玩",
      state: "open",
      created_at: "1590486176000",
      update_at: "1590486176000"
    }
  ];
  
  let i = 0;
  
  export default () => {
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() => [
      624748504
    ]);
    const [position, setPosition] = useState<"top" | "bottom" | "hidden">(
      "bottom"
    );
    const [radioType, setRadioType] = useState("table");
    const formRef = useRef<ProFormInstance<any>>();
    const editorFormRef = useRef<EditableFormInstance<DataSourceType>>();
    const columns: ProColumns<DataSourceType>[] = [
      {
        title: "活动名称",
        dataIndex: "title",
        formItemProps: () => {
          return {
            rules: [{ required: true, message: "此项为必填项" }]
          };
        },
        width: "30%"
      },
      {
        title: "状态",
        key: "state",
        dataIndex: "state",
        valueType: "select",
        valueEnum: {
          all: { text: "全部", status: "Default" },
          open: {
            text: "未解决",
            status: "Error"
          },
          closed: {
            text: "已解决",
            status: "Success"
          }
        }
      },
      {
        title: "描述",
        dataIndex: "decs"
      },
      {
        title: "活动时间",
        dataIndex: "created_at",
        valueType: "date"
      }
    ];
  
    return (
      <ProForm<{
        table: DataSourceType[];
      }>
        formRef={formRef}
        initialValues={{
          data: defaultData,
          radio: "table"
        }}
      >
        <span style={{ fontWeight: "bold" }}>
          切换Radio到【文本】再切换【表格】后，通过formRef获取的data就变为了一个Json（字典）对象，而不是期望的字符串数组（控制台有打印）
        </span>
        <ProFormRadio.Group
          name="radio"
          options={[
            {
              label: "表格",
              value: "table"
            },
            {
              label: "文本",
              value: "text"
            }
          ]}
          fieldProps={{
            onChange: (e) => {
              //获取值变为了一个字典，且增加了为0的key，如：{0:{1}}
              const curData = formRef.current?.getFieldValue("data");
              console.log("form的data字段切换前的值：", curData);
              const type = e.target.value;
              let nowData: any;
              if (type === "table") {
                nowData = [];
                formRef.current?.setFieldsValue({ data: nowData }); //本想通过eval(data)来回填表格
              } else {
                nowData = JSON.stringify(curData);
                formRef.current?.setFieldsValue({ data: nowData }); //设置data的值为123
              }
              setRadioType(e.target.value);
              console.log("form的data字段切换后的值：", nowData);
            }
          }}
        />{" "}
        {radioType === "table" ? (
          <EditableProTable<DataSourceType>
            rowKey="id"
            scroll={{
              x: 960
            }}
            editableFormRef={editorFormRef}
            headerTitle="可编辑表格"
            maxLength={5}
            name="data"
            toolBarRender={false}
            columns={columns}
            editable={{
              type: "multiple",
              editableKeys,
              onChange: setEditableRowKeys,
              actionRender: (row, _, dom) => {
                return [dom.delete];
              }
            }}
          />
        ) : (
          <ProFormTextArea
            name="data"
            rules={[{ type: "string" }]}
            fieldProps={{
              autoSize: { minRows: 9 }
            }}
          />
        )}
      </ProForm>
    );
  };
  