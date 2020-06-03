import React from 'react';
import { Button, Form, Input, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { history } from 'umi';

const LoginPage = () => {
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
          if (account === 'admin' && password === 'admin') {
            sessionStorage.setItem('ADMIN_LOGGED', 'true');
            history.push('/admin/systemConfig');
          } else {
            message.error('账号密码错误');
          }
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
