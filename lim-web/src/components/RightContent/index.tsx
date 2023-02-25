import { message, Dropdown, Modal, Input, Form, Menu, Avatar, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { PwdForm } from './form';
import { changePassword, login } from '@/services/user';
var user = '';
var password = '';
const GlobalHeaderRight: React.FC = () => {
  const [pwdOpen, setPwdOpen] = useState<boolean>(false); //控制弹窗显示还是隐藏
  const getUserInfo = () =>
    localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo') as any) : {};
  const [username, setUsername] = useState(getUserInfo().name || '');
  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={() => message.warning('待实现！')}>
        个人中心
      </Menu.Item>
      <Menu.Item key="pwd" onClick={() => showModal()}>
        修改密码
      </Menu.Item>
      <Menu.Item
        key="2"
        onClick={() => {
          localStorage.setItem('token', '');
          const userInfo = getUserInfo();
          userInfo.name = '';
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
          setUsername('');
          message.success('退出成功！');
        }}
      >
        退出
      </Menu.Item>
    </Menu>
  );
  //点击新建/修改，执行的代码
  const showModal = () => {
    setPwdOpen(true);
  };
  // 弹窗点确认按钮执行的方法
  const onFormFinish = async (values: any) => {
    return await changePassword(values).then((res) => {
      message.success(res.msg);
      setPwdOpen(false);
    });
  };
  const loginForm = {
    title: '请先登录，无账号请联系管理员获取',
    okText: '登录',
    onCancel: () => Modal.destroyAll(),
    onOk: async () => {
      await login({ username: user, password: password }).then((res) => {
        localStorage.setItem('token', res.results.token);
        localStorage.setItem('userInfo', JSON.stringify(res.results.user_info));
        setUsername(res.results.user_info.name);
        message.success('登录成功！');
        Modal.destroyAll();
      });
    },
    content: (
      <Form style={{ marginTop: 26 }} name="basic" labelCol={{ span: 4 }}>
        <Form.Item label="账号" name="username" rules={[{ required: true }]}>
          <Input placeholder="测试账号：admin" onChange={(e) => (user = e.target.value)} />
        </Form.Item>
        <Form.Item label="密码" name="password" rules={[{ required: true }]}>
          <Input.Password placeholder="测试密码：123456" onChange={(e) => (password = e.target.value)} />
        </Form.Item>
      </Form>
    ),
  };
  return (
    <>
      {username ? (
        <Dropdown placement="bottomRight" overlay={menu}>
          <div>
            <Avatar
              style={{ backgroundColor: '#7265e6' }}
              size={36}
              src="https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg"
            />
            <span style={{ marginLeft: 10 }}>{username || '游客'}</span>
          </div>
        </Dropdown>
      ) : (
        <Button
          style={{ marginLeft: 10 }}
          onClick={() => {
            Modal.confirm(loginForm);
          }}
        >
          {`> `}点我登录
        </Button>
      )}
      <a
        id="login"
        onClick={() => {
          Modal.confirm(loginForm);
        }}
      ></a>
      <PwdForm onFinish={(values: object) => onFormFinish(values)} open={pwdOpen} setOpen={setPwdOpen} />
    </>
  );
};

export default GlobalHeaderRight;
