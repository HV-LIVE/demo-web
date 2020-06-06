import React from 'react';
import ContentWrapper from '@/components/content_wrapper';
import { Button, Form, Input, InputNumber, message } from 'antd';
import { useRequest } from '@umijs/hooks';
import Api, { SystemConfig } from '@/api';
import Styles from './index.less';

const SystemConfigPage = () => {
  const { error, loading, data, mutate } = useRequest(Api.getSystemConfig);
  const updateRequest = useRequest(Api.updateSystemConfig, {
    manual: true,
    onSuccess: res => {
      mutate(res);
      message.success('修改成功');
    },
  });

  return (
    <ContentWrapper loading={loading} error={error}>
      <Form
        className={Styles.root}
        name="system_config"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 4 }}
        hideRequiredMark
        initialValues={data}
        onFinish={config => updateRequest.run(config as SystemConfig)}
      >
        <Form.Item
          label="推流服务器IP"
          name="pushIp"
          rules={[{ required: true, message: '请输入推流服务器IP' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="推流服务器端口"
          name="pushPort"
          rules={[{ required: true, message: '请输入推流服务器端口' }]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item
          label="播放服务器IP"
          name="pullIp"
          rules={[{ required: true, message: '请输入播放服务器IP' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="播放服务器端口"
          name="pullPort"
          rules={[{ required: true, message: '请输入播放服务器端口' }]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 4 }}>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
        </Form.Item>
      </Form>
    </ContentWrapper>
  );
};

export default SystemConfigPage;
