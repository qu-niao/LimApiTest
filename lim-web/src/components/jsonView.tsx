import ReactJson from 'react-json-view';
const JsonView = (props: any) => {
  return (
    <ReactJson
      displayArrayKey={false}
      collapseStringsAfterLength={1000}
      name={false}
      displayDataTypes={false}
      {...props}
    />
  ); //避免displayArrayKey报错
};
export default JsonView;
