import React, { useState, useRef, useEffect } from 'react';
import { Button, Input, Upload, message, Radio, Tooltip, AutoComplete, Select, Checkbox } from 'antd';
import { getValueType } from '@/utils/utils';
import { ExclamationCircleTwoTone, UploadOutlined } from '@ant-design/icons';
import { EQUAL, EXPECT_RULE_LABEL, FORM_FILE_TYPE, FORM_TEXT_TYPE } from '@/utils/constant';
import { putFile } from '@/services/comApi';

export const ParamValue = ({ onChange, value, editorFormRef, reqParamType, index, setParmTypeFunc }: any) => {
  const [inputValue, setInputValue] = useState<any>(value || '');
  const handleInputChange = (v: string) => {
    setInputValue(v);
    onChange(v);
    const data = editorFormRef.current?.getRowData(index);
    if (!['header', 'query', 'output'].includes(reqParamType) && data.type.auto) {
      editorFormRef.current?.setRowData?.(index, { type: { type: getValueType(v), auto: true } });
      setParmTypeFunc(reqParamType, index, { type: getValueType(v), auto: true });
    }
  };

  return (
    <>
      {' '}
      <AutoComplete
        placeholder="请输入值"
        value={inputValue}
        // onSelect={(...data: any) => loadApiCaseData(data[1].case_id)}
        onChange={handleInputChange}
        // options={loadCaseData}
      />
    </>
  );
};

export const ParamType: React.FC<any> = ({
  value,
  onChange,
  reqParamType,
  paramTypeCand,
  index,
  setParmTypeFunc,
}) => {
  const [fieldValue, setFieldValue] = useState<any>({});
  useEffect(() => {
    setFieldValue(value);
  }, [value]);
  const needSetType = !['header', 'query'].includes(reqParamType);
  return (
    <>
      <Select
        value={fieldValue?.type || 'string'}
        style={{ width: 120 }}
        disabled={!needSetType}
        fieldNames={{ value: 'id', label: 'name' }}
        onChange={(v) => {
          let _v = { ...fieldValue };
          _v.type = v;
          setFieldValue(_v);
          onChange(_v);
          setParmTypeFunc(reqParamType, index, _v);
        }}
        options={paramTypeCand}
      />
      {needSetType ? (
        <Checkbox
          style={{ marginLeft: 10 }}
          onChange={(e) => {
            let _v = { ...fieldValue };
            _v.auto = e.target.checked;
            setFieldValue(_v);
            onChange(_v);
            setParmTypeFunc(reqParamType, index, _v);
          }}
          checked={fieldValue.auto}
        >
          自动识别
        </Checkbox>
      ) : null}
    </>
  );
};
const ExpectValue = ({ onChange, value }: any) => {
  return (
    <Select
      value={value || EQUAL}
      fieldNames={{ value: 'id', label: 'name' }}
      onChange={(v) => {
        onChange(v);
      }}
      options={EXPECT_RULE_LABEL}
    />
  );
};
export const paramsColumns = (
  type: string,
  paramTypeCand: any,
  editorFormRef: any,
  setParmTypeFunc: Function,
) => {
  let nameLabel: string;
  let valueLabel: string;
  let typeLabel: string;
  switch (type) {
    case 'expect':
      nameLabel = '响应字段名称';
      valueLabel = '期望值';
      typeLabel = '期望值类型';
      break;
    case 'output':
      nameLabel = '输出变量名称(末尾输入"?"则不参与断言，如:name?)';
      valueLabel = '输出响应字段';
      typeLabel = '';
      break;
    default:
      nameLabel = '字段名称';
      valueLabel = '字段值';
      typeLabel = '字段类型';
      break;
  }
  if (type == 'expect') {
  }
  let columns: any = [
    {
      title: nameLabel,
      dataIndex: 'name',
      formItemProps: {
        hasFeedback: false, //可以去除校验图标
        rules: [
          {
            required: true,
            message: '此项是必填项',
          },
        ],
      },
      width: '30%',
    },
  ];
  if (type === 'expect') {
    columns.push({
      title: '判断规则',
      width: '10%',
      dataIndex: 'rule',
      renderFormItem: () => <ExpectValue />,
    });
  }
  if (type !== 'output') {
    columns = [
      ...columns,
      ...[
        {
          title: valueLabel,
          width: type == 'expect' ? '25%' : '35%',
          dataIndex: 'value',
          renderFormItem: ({ index }: any) => (
            <ParamValue
              reqParamType={type}
              index={index}
              editorFormRef={editorFormRef}
              setParmTypeFunc={setParmTypeFunc}
            />
          ),
        },
        {
          title: (
            <Tooltip overlayStyle={{ maxWidth: 600 }} placement="right" title="请求头和Url只能携带字符串参数">
              {typeLabel}
              <ExclamationCircleTwoTone twoToneColor="#FAAD14" style={{ marginLeft: 6 }} />
            </Tooltip>
          ),
          width: '25%',
          dataIndex: 'type',
          renderFormItem: ({ index }: any) => (
            <ParamType
              reqParamType={type}
              index={index}
              paramTypeCand={paramTypeCand}
              setParmTypeFunc={setParmTypeFunc}
            />
          ),
        },

        {
          title: '操作',
          width: '10%',
          valueType: 'option',
        },
      ],
    ];
  } else {
    columns = [
      ...columns,
      ...[
        {
          title: valueLabel,
          width: '25%',
          dataIndex: 'value',
          renderFormItem: ({ index }: any) => (
            <ParamValue
              reqParamType={type}
              index={index}
              editorFormRef={editorFormRef}
              setParmTypeFunc={setParmTypeFunc}
            />
          ),
        },
        {
          title: '操作',
          width: '10%',
          valueType: 'option',
        },
      ],
    ];
  }

  return columns;
};

export const ParmFormDataValue: React.FC<any> = ({ value, onChange }) => {
  const ref = useRef<any>(null);
  const [inputValue, setInputValue] = useState<any>(value?.value || '');
  const [paramType, setParamType] = useState<any>(value?.type || FORM_TEXT_TYPE);
  const [fileList, setFileList] = useState<any>(
    value?.type === FORM_FILE_TYPE
      ? [
          {
            uid: '1',
            name: value.name,
            status: 'done',
            url: value.value,
          },
        ]
      : [],
  );
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onChange({ value: e.target.value, type: FORM_TEXT_TYPE });
  };
  return (
    <div style={{ display: 'flex' }}>
      {paramType === FORM_TEXT_TYPE ? (
        <Input
          key="input"
          ref={ref}
          type="text"
          style={{ width: '75%' }}
          placeholder="请输入"
          onChange={handleInputChange}
          value={inputValue}
        />
      ) : (
        <div style={{ width: '75%' }}>
          <Upload
            beforeUpload={(file: any) => {
              if (file.size / 1024000 > 3) {
                message.error('上传的文件，大小不能超过3M！');
                //设置文件上传的status为error
                file.status = 'error';
                return false;
              }
            }}
            customRequest={(info: any) => {
              putFile(info.file, '/apiFile').then((res) => {
                onChange({
                  value: res.results.file_url,
                  type: FORM_FILE_TYPE,
                  name: res.results.file_name,
                });
                setFileList([
                  {
                    uid: '1',
                    name: res.results.file_name,
                    status: 'done',
                    url: res.results.file_url,
                  },
                ]);
                info.onSuccess('res', info.file); //上传成功需要通过onsuccess改状态
              });
            }}
            onRemove={(e) => {
              setFileList([]);
            }}
            showUploadList={{ showPreviewIcon: false }}
            fileList={fileList}
            maxCount={1}
          >
            {fileList.length > 0 ? null : <Button icon={<UploadOutlined />}>上传文件</Button>}
          </Upload>
        </div>
      )}
      <Radio.Group
        options={[
          { label: '文本', value: FORM_TEXT_TYPE },
          { label: '文件', value: FORM_FILE_TYPE },
        ]}
        onChange={(e) => setParamType(e.target.value)}
        value={paramType}
        optionType="button"
      />
    </div>
  );
};
export const paramsFormDataColumns = () => {
  return [
    {
      title: '字段名称',
      dataIndex: 'name',
      formItemProps: {
        hasFeedback: false, //可以去除校验图标
        rules: [
          {
            required: true,
            message: '此项是必填项',
          },
        ],
      },
      width: '30%',
    },
    {
      title: '字段值',
      width: '60%',
      key: 'value',
      dataIndex: 'value',
      renderFormItem: ({ type, defaultRender, formItemProps, fieldProps, ...rest }: any) => (
        <ParmFormDataValue />
      ),
    },
    {
      title: '操作',
      width: '10%',
      valueType: 'option',
    },
  ];
};
