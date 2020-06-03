import React from 'react';
import {
  Button,
  Cascader,
  Col,
  DatePicker,
  Descriptions,
  Form,
  Input,
  message,
  Row,
  Select,
  Table,
} from 'antd';
import { useRequest, useSessionStorageState } from '@umijs/hooks';
import Api, { Channel, Live } from '@/api';
import { ColumnType } from 'antd/es/table';
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

const InfoPage = () => {
  const [userId] = useSessionStorageState('USER_LOGGED', 0);
  if (!userId) {
    return;
  }

  const { data: user, error: userError, loading: userLoading } = useRequest(() => Api.getUser(userId));
  const { data: systemConfig, error: systemConfigError, loading: systemConfigLoading } = useRequest(Api.getSystemConfig);
  const { data: channels, error: channelsError, loading: channelsLoading } = useRequest(Api.getAllChannelsAndSections);
  const { data: lives, error: livesError, loading: livesLoading, mutate: liveMutate } = useRequest(() => Api.getUserLives(userId));
  const createRequest = useRequest(Api.createLive, {
    manual: true,
    onSuccess: (res) => {
      liveMutate((old) => [...old, res]);
      message.success('创建成功');
    },
  });
  const deleteRequest = useRequest(Api.deleteLive, {
    manual: true,
    onSuccess: (res, [id]) => {
      liveMutate((old) => old.filter(i => i.id !== id));
      message.success('删除成功');
    },
  });

  if (userError) {
    return (<div>load error</div>);
  }
  if (systemConfigError) {
    return (<div>load error</div>);
  }
  if (livesError) {
    return (<div>load error</div>);
  }
  if (channelsError) {
    return (<div>load error</div>);
  }
  if (userLoading || systemConfigLoading || livesLoading || channelsLoading) {
    return (<div>loading...</div>);
  }

  return (
    <div style={{ padding: '40px' }}>
      <Descriptions title="User Info" layout="vertical" bordered>
        <Descriptions.Item label="Account">{user?.account}</Descriptions.Item>
        <Descriptions.Item label="Name">{user?.name}</Descriptions.Item>
        <Descriptions.Item label="Phone Number">{user?.phoneNumber}</Descriptions.Item>
        <Descriptions.Item label="Create Time">{user?.createTime}</Descriptions.Item>
      </Descriptions>
      <Descriptions title="Settings" layout="vertical" bordered style={{ marginTop: 40 }}>
        <Descriptions.Item label="Push Ip">{systemConfig?.pushIp}</Descriptions.Item>
        <Descriptions.Item label="Push Port">{systemConfig?.pushPort}</Descriptions.Item>
        <Descriptions.Item label="Pull Ip">{systemConfig?.pullIp}</Descriptions.Item>
        <Descriptions.Item label="Pull Port">{systemConfig?.pullPort}</Descriptions.Item>
        <Descriptions.Item label="Stream Name">{user?.streamName}</Descriptions.Item>
      </Descriptions>
      <Descriptions title="Lives" layout="vertical" bordered style={{ marginTop: 40 }}>
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
                userId: userId,
              };
              return createRequest.run(live as Live);
            }}
          >
            <Row>
              <Col span={5} key="title">
                <Form.Item
                  label="Title"
                  name="title"
                  rules={[{ required: true, message: 'Please input your username!' }]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={6} key="channelIdAndSectionId">
                <Form.Item
                  label="Section"
                  name="channelIdAndSectionId"
                  rules={[{ required: true, message: 'Please input your password!' }]}
                >
                  <Cascader options={mapChannelsToOptions(channels || [])} />
                </Form.Item>
              </Col>

              <Col span={8} key="timeRange">
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

              <Col span={3} key="submit">
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
            dataSource={lives}
            columns={createColumns(live => deleteRequest.run(live.id))}
            pagination={false}
          />
        </div>
      </Descriptions>
    </div>
  );
};

export default InfoPage;
