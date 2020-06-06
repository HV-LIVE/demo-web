import React from 'react';
import {
  Button,
  Cascader,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Row,
  Select,
  Table,
} from 'antd';
import { ColumnType } from 'antd/es/table';
import { useRequest } from '@umijs/hooks';
import Api, { Channel, Live, User } from '@/api';
import { CascaderOptionType } from 'antd/es/cascader';
import ContentWrapper from '@/components/content_wrapper';
import Styles from './index.less';

const createColumns = (
  handleDelete: (live: Live) => void,
): ColumnType<Live>[] => {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '频道',
      dataIndex: ['channel', 'name'],
    },
    {
      title: '栏目',
      dataIndex: ['section', 'name'],
    },
    {
      title: '用户',
      dataIndex: ['user', 'name'],
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      render: (_, live) => {
        return (
          <React.Fragment>
            <Button type="ghost" danger onClick={() => handleDelete(live)}>
              删除
            </Button>
          </React.Fragment>
        );
      },
    },
  ];
};

const mapChannelsToOptions = (channels: Channel[]): CascaderOptionType[] =>
  channels
    .filter(channels => channels.sections && channels.sections.length)
    .map(channel => ({
      value: channel.id,
      label: channel.name,
      children: channel.sections
        ? channel.sections.map(section => ({
            value: section.id,
            label: section.name,
          }))
        : undefined,
    }));

const mapUserToOptions = (users: User[]): any[] =>
  users.map(user => ({
    label: user.name,
    value: user.id,
  }));

const LivesPage = () => {
  const [form] = Form.useForm();
  const {
    data: livesData,
    error: livesError,
    loading: livesLoading,
    mutate: livesMutate,
  } = useRequest(Api.getAllLives);
  const {
    data: channelsData,
    error: channelsError,
    loading: channelsLoading,
  } = useRequest(Api.getAllChannelsAndSections);
  const {
    data: usersData,
    error: usersError,
    loading: usersLoading,
  } = useRequest(Api.getAllUsers);
  const createRequest = useRequest(Api.createLive, {
    manual: true,
    onSuccess: res => {
      livesMutate(old => [...old, res]);
      form.resetFields();
      message.success('创建成功');
    },
  });
  const deleteRequest = useRequest(Api.deleteLive, {
    manual: true,
    onSuccess: (res, [id]) => {
      livesMutate(old => old.filter(i => i.id !== id));
      message.success('删除成功');
    },
  });

  return (
    <ContentWrapper
      loading={livesLoading || channelsLoading || usersLoading}
      error={livesError || channelsError || usersError}
    >
      <div className={Styles.root}>
        <Form
          name="live"
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
          hideRequiredMark
          form={form}
        >
          <Row gutter={30} justify="center">
            <Col span={4} key="title">
              <Form.Item
                label="标题"
                name="title"
                rules={[{ required: true, message: '请输入标题' }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={4} key="channelIdAndSectionId">
              <Form.Item
                label="栏目"
                name="channelIdAndSectionId"
                rules={[{ required: true, message: '请选择栏目' }]}
              >
                <Cascader options={mapChannelsToOptions(channelsData || [])} />
              </Form.Item>
            </Col>

            <Col span={4} key="userId">
              <Form.Item
                label="用户"
                name="userId"
                rules={[{ required: true, message: '请选择用户' }]}
              >
                <Select options={mapUserToOptions(usersData || [])} />
              </Form.Item>
            </Col>

            <Col span={8} key="timeRange">
              <Form.Item
                label="直播时间"
                name="timeRange"
                rules={[{ required: true, message: '请选择直播时间' }]}
              >
                <DatePicker.RangePicker
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                />
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
          dataSource={livesData}
          columns={createColumns(live => deleteRequest.run(live.id))}
          pagination={false}
        />
      </div>
    </ContentWrapper>
  );
};

export default LivesPage;
