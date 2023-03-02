import { useCallback, useEffect, useRef } from 'react';
import _ from 'lodash';
import JSONEditor from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.css';
import styles from './index.less';
const SMJsonEditor = (props: any) => {
  const { value, onChange, options = {} } = props;
  const editorRef = useRef<any>();
  const editorObj = useRef<any>();
  // 注意这边暴露到外面的是一个json
  const handleChange = useCallback(
    (value) => {
      try {
        const currenValue = value === '' ? null : editorObj.current.get();
        onChange && onChange(currenValue);
      } catch (err) {}
    },
    [onChange],
  );

  // 初始化JSON编辑器
  const initEditor = useCallback(() => {
    if (!editorObj.current) {
      const totalOptions = {
        mode: 'code',
        onChangeText: handleChange,
        ...options,
      };
      editorObj.current = new JSONEditor(editorRef.current, totalOptions);
    }
  }, [handleChange, options]);

  useEffect(() => {
    initEditor();
  }, [initEditor]);

  // 监听外部传入的value
  useEffect(() => {
    try {
      if (value && !_.isEqual(editorObj.current.get(), value)) {
        editorObj.current.update(value);
      }
    } catch (error) {
      // 当编辑器内容为空时，editorObj.current.get()会抛出异常，所以这里需要捕获
    }
  }, [value]);

  return <div className={styles['sm-json-editor']} style={{ height: props.height || 400 }} ref={editorRef} />;
};

export default SMJsonEditor;
