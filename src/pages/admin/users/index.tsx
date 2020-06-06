import React from 'react';
import { Button, Col, Form, Input, message, Row, Table } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useRequest } from '@umijs/hooks';
import Api, { User } from '@/api';
import ContentWrapper from '@/components/content_wrapper';
import Styles from './index.less';

const createColumns = (
  handleDelete: (user: User) => void,
): ColumnType<User>[] => {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '账号',
      dataIndex: 'account',
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '手机号',
      dataIndex: 'phoneNumber',
    },
    {
      title: '串流密钥',
      dataIndex: 'streamKey',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      render: (_, user) => {
        return (
          <React.Fragment>
            <Button type="ghost" danger onClick={() => handleDelete(user)}>
              删除
            </Button>
          </React.Fragment>
        );
      },
    },
  ];
};

const UsersPage = () => {
  const [form] = Form.useForm();
  const { data, error, loading, mutate } = useRequest(Api.getAllUsers);
  const createRequest = useRequest(Api.createUser, {
    manual: true,
    onSuccess: res => {
      mutate(old => [...old, res]);
      form.resetFields();
      message.success('创建成功');
    },
  });
  const deleteRequest = useRequest(Api.deleteUser, {
    manual: true,
    onSuccess: (res, [id]) => {
      mutate(old => old.filter(i => i.id !== id));
      message.success('删除成功');
    },
  });

  return (
    <ContentWrapper loading={loading} error={error}>
      <div className={Styles.root}>
        <Form
          name="user"
          onFinish={user => createRequest.run(user as User)}
          hideRequiredMark
          form={form}
        >
          <Row gutter={30} justify="center">
            <Col span={5} key="account">
              <Form.Item
                label="账号"
                name="account"
                rules={[{ required: true, message: '请输入账号' }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={5} key="password">
              <Form.Item
                label="密码"
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={5} key="name">
              <Form.Item
                label="姓名"
                name="name"
                rules={[{ required: true, message: '请输入姓名' }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={5} key="phoneNumber">
              <Form.Item
                label="手机号"
                name="phoneNumber"
                rules={[{ required: true, message: '请输入手机号' }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col key="submit">
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  创建
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <Table
          rowKey="id"
          dataSource={data}
          columns={createColumns(user => deleteRequest.run(user.id))}
          pagination={false}
        />
      </div>
    </ContentWrapper>
  );
};

export default UsersPage;
