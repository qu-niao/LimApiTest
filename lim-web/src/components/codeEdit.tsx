import CodeMirror from '@uiw/react-codemirror';
import { StreamLanguage } from '@codemirror/language';
import { python } from '@codemirror/legacy-modes/mode/python';
import { mySQL } from '@codemirror/legacy-modes/mode/sql';
import { json } from '@codemirror/legacy-modes/mode/javascript';
export const CodeEditNode = ({
  onChangeFunc,
  onBlurFunc,
  initValue,
  codeType = 'python',
}: any) => {
  let codeLanguage;
  switch (codeType) {
    case 'python':
      codeLanguage = python;
      break;
    case 'sql':
      codeLanguage = mySQL;
      break;
    case 'json':
      codeLanguage = json;
      break;
    default:
      codeLanguage = python;
  }
  if (typeof initValue !== 'string') {
    initValue = '';
  }
  return (
    <CodeMirror
      value={initValue}
      height="200px"
      onBlur={(e) => {
        if (onBlurFunc) {
          onBlurFunc();
        }
      }}
      extensions={[StreamLanguage.define(codeLanguage)]}
      onChange={onChangeFunc}
    />
  );
};
