import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Cascader, Col, DatePicker, Form, Input, message, Row, Table, Select } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useRequest } from '@umijs/hooks';
import Api, { Channel, Live, User } from '@/api';
import { CascaderOptionType } from 'antd/es/cascader';

const createColumns = (handleDelete: (live: Live) => void): ColumnType<Live>[] => {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'TITLE',
      dataIndex: 'title',
    },
    {
      title: 'CHANNEL',
      dataIndex: ['channel', 'name'],
    },
    {
      title: 'SECTION',
      dataIndex: ['section', 'name'],
    },
    {
      title: 'USER',
      dataIndex: ['user', 'name'],
    },
    {
      title: 'START_TIME',
      dataIndex: 'startTime',
    },
    {
      title: 'END_TIME',
      dataIndex: 'endTime',
    },
    {
      title: 'CREATE_TIME',
      dataIndex: 'createTime',
    },
    {
      title: 'ACTIONS',
      render: (_, live) => {
        return (
          <React.Fragment>
            <Button type="ghost" danger onClick={() => handleDelete(live)}>删除</Button>
          </React.Fragment>
        );
      },
    },
  ];
};

const mapChannelsToOptions = (channels: Channel[]): CascaderOptionType[] => (
  channels
    .filter(channels => channels.sections && channels.sections.length)
    .map(channel => ({
      value: channel.id,
      label: channel.name,
      children: channel.sections ? channel.sections.map(section => ({
        value: section.id,
        label: section.name,
      })) : undefined,
    }))
);

const mapUserToOptions = (users: User[]): any[] => (
  users
    .map(user => ({
      label: user.name,
      value: user.id,
    }))
);

const LivesPage = () => {
  const { data, error, loading, mutate } = useRequest(Api.getAllLives);
  const channelRequest = useRequest(Api.getAllChannelsAndSections);
  const userRequest = useRequest(Api.getAllUsers);
  const createRequest = useRequest(Api.createLive, {
    manual: true,
    onSuccess: (res) => {
      mutate((old) => [...old, res]);
      message.success('创建成功');
    },
  });
  const deleteRequest = useRequest(Api.deleteLive, {
    manual: true,
    onSuccess: (res, [id]) => {
      mutate((old) => old.filter(i => i.id !== id));
      message.success('删除成功');
    },
  });

  if (error) {
    return (<div>load error</div>);
  }
  if (channelRequest.error) {
    return (<div>load error</div>);
  }
  if (loading || channelRequest.loading) {
    return (<div>loading...</div>);
  }

  return (
    <PageHeaderWrapper>
      <div>
        <Form
          name="basic"
          onFinish={data => {
            const live = {
              title: data.title,
              channelId: data.channelIdAndSectionId[0],
              sectionId: data.channelIdAndSectionId[1],
              startTime: data.timeRange[0].utc(8).toISOString(),
              endTime: data.timeRange[1].utc(8).toISOString(),
              userId: data.userId,
            };
            return createRequest.run(live as Live);
          }}
        >
          <Row>
            <Col span={5} key="0">
              <Form.Item
                label="Title"
                name="title"
                rules={[{ required: true, message: 'Please input your username!' }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={6} key="1">
              <Form.Item
                label="Section"
                name="channelIdAndSectionId"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Cascader options={mapChannelsToOptions(channelRequest.data || [])} />
              </Form.Item>
            </Col>

            <Col span={6} key="2">
              <Form.Item
                label="User"
                name="userId"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Select options={mapUserToOptions(userRequest.data || [])} />
              </Form.Item>
            </Col>

            <Col span={8} key="3">
              <Form.Item
                label="Time Range"
                name="timeRange"
                rules={[{ required: true, message: 'Please input your username!' }]}
              >
                <DatePicker.RangePicker
                  showTime={{ format: 'HH:mm' }}
                />
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
          columns={createColumns(live => deleteRequest.run(live.id))}
          pagination={false}
        />
      </div>
    </PageHeaderWrapper>
  );
};

export default LivesPage;
