import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Form, Input, InputNumber, message } from 'antd';
import { useRequest } from '@umijs/hooks';
import Api, { SystemConfig } from '@/api';

const SystemConfigPage = () => {
  const { error, loading, data, mutate } = useRequest(Api.getSystemConfig);
  const updateRequest = useRequest(Api.updateSystemConfig, {
    manual: true,
    onSuccess: (res) => {
      mutate(res);
      message.success('修改成功');
    },
  });

  if (error) {
    return (<div>load error</div>);
  }
  if (loading) {
    return (<div>loading...</div>);
  }

  return (
    <PageHeaderWrapper>
      <Form
        name="basic"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 8 }}
        initialValues={data}
        onFinish={(config) => {
          updateRequest.run(config as SystemConfig);
        }}
      >
        <Form.Item
          label="Push IP"
          name="pushIp"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Push Port"
          name="pushPort"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item
          label="Pull IP"
          name="pullIp"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Pull Port"
          name="pullPort"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </PageHeaderWrapper>
  );
};

export default SystemConfigPage;
