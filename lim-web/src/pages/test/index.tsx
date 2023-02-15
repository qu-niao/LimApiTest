import { Button, Modal, message, Form, Input, notification } from 'antd';
import React, { createContext } from 'react';
import { login } from '@/services/user';
const ReachableContext = createContext<string | null>(null);
let username = '';
let password = '';
const config = {
  title: '请先登录，无账号请联系管理员获取',
  okText: '登录',
  cancelText: '取消',
  onCancel: () => Modal.destroyAll(),
  onOk: async () => {
    await login({ username: username, password: password }).then((res) => {
      localStorage.setItem('token', res.results.token);
      localStorage.setItem('userInfo', JSON.stringify(res.results.user_info));
    });
    Modal.destroyAll();
  },
  content: (
    <Form style={{ marginTop: 26 }} name="basic" labelCol={{ span: 4 }}>
      <Form.Item label="账号" name="username" rules={[{ required: true }]}>
        <Input placeholder="测试账号：admin" onChange={(e) => (username = e.target.value)} />
      </Form.Item>
      <Form.Item label="密码" name="password" rules={[{ required: true }]}>
        <Input.Password placeholder="测试密码：123456" onChange={(e) => (password = e.target.value)} />
      </Form.Item>
    </Form>
  ),

  // content: (
  //   <>
  //     <ReachableContext.Consumer>{(name) => `Reachable: ${name}!`}</ReachableContext.Consumer>
  //   </>
  // ),
};

const App: React.FC = () => {
  const [modal, contextHolder] = Modal.useModal(); 
  return (
    <ReachableContext.Provider value="Light">
      <Button
        onClick={() => {
          modal.confirm(config);
        }}
      >
        Confirm
      </Button>

      {/* `contextHolder` should always be placed under the context you want to access */}
      {contextHolder}
    </ReachableContext.Provider>
  );
};

export default App;
