import React from 'react';
import { Button, Form, Input, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { history } from 'umi';
import { useRequest } from '@umijs/hooks';
import Api from '@/api';

const LoginPage = () => {
  const loginRequest = useRequest(Api.login, {
    manual: true,
    onSuccess: user => {
      sessionStorage.setItem('USER_LOGGED', `${user.id}`);
      history.push('/user/info');
      message.success('登录成功');
    },
  });

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Form
        name="normal_login"
        style={{ width: '300px' }}
        onFinish={(data) => {
          const { account, password } = data;
          return loginRequest.run(account, password);
        }}
      >
        <Form.Item
          name="account"
          rules={[{ required: true, message: 'Please input your Username!' }]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
