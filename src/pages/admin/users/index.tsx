import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Col, Form, Input, message, Row, Table } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useRequest } from '@umijs/hooks';
import Api, { User } from '@/api';

function createColumns(handleDelete: (user: User) => void): ColumnType<User> [] {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'ACCOUNT',
      dataIndex: 'account',
    },
    {
      title: 'NAME',
      dataIndex: 'name',
    },
    {
      title: 'PHONE_NUMBER',
      dataIndex: 'phoneNumber',
    },
    {
      title: 'CREATE_TIME',
      dataIndex: 'createTime',
    },
    {
      title: 'ACTIONS',
      render: (_, user) => {
        return (
          <React.Fragment>
            <Button type="ghost" danger onClick={() => handleDelete(user)}>删除</Button>
          </React.Fragment>
        );
      },
    },
  ];
}

const UsersPage = () => {
  const { data, error, loading, mutate } = useRequest(Api.getAllUsers);
  const createRequest = useRequest(Api.createUser, {
    manual: true,
    onSuccess: (res) => {
      mutate((old) => [...old, res]);
      message.success('创建成功');
    },
  });
  const deleteRequest = useRequest(Api.deleteUser, {
    manual: true,
    onSuccess: (res, [id]) => {
      mutate((old) => old.filter(i => i.id !== id));
      message.success('删除成功');
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
      <div>
        <Form
          name="basic"
          onFinish={user => createRequest.run(user as User)}
        >
          <Row>
            <Col span={5} key="0">
              <Form.Item
                label="Account"
                name="account"
                rules={[{ required: true, message: 'Please input your username!' }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={5} key="1">
              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={5} key="2">
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: 'Please input your username!' }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={5} key="3">
              <Form.Item
                label="Phone Number"
                name="phoneNumber"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={3} key="4">
              <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
                <Button type="primary" htmlType="submit">
                  Submit
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
    </PageHeaderWrapper>
  );
};

export default UsersPage;
