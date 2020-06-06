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
  Table,
} from 'antd';
import { useRequest, useSessionStorageState } from '@umijs/hooks';
import Api, { Channel, Live } from '@/api';
import { ColumnType } from 'antd/es/table';
import { CascaderOptionType } from 'antd/es/cascader';
import Styles from './index.less';
import ContentWrapper from '@/components/content_wrapper';

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

const InfoPage = () => {
  const [form] = Form.useForm();
  const [userId] = useSessionStorageState('USER_LOGGED', 0);
  const {
    data: user,
    error: userError,
    loading: userLoading,
  } = useRequest(() => Api.getUser(userId));
  const {
    data: systemConfig,
    error: systemConfigError,
    loading: systemConfigLoading,
  } = useRequest(Api.getSystemConfig);
  const {
    data: channels,
    error: channelsError,
    loading: channelsLoading,
  } = useRequest(Api.getAllChannelsAndSections);
  const {
    data: lives,
    error: livesError,
    loading: livesLoading,
    mutate: liveMutate,
  } = useRequest(() => Api.getUserLives(userId));
  const createRequest = useRequest(Api.createLive, {
    manual: true,
    onSuccess: res => {
      liveMutate(old => [...old, res]);
      form.resetFields();
      message.success('创建成功');
    },
  });
  const deleteRequest = useRequest(Api.deleteLive, {
    manual: true,
    onSuccess: (res, [id]) => {
      liveMutate(old => old.filter(i => i.id !== id));
      message.success('删除成功');
    },
  });

  return (
    <ContentWrapper
      loading={
        userLoading || systemConfigLoading || livesLoading || channelsLoading
      }
      error={userError || systemConfigError || livesError || channelsError}
    >
      <div className={Styles.root}>
        <Descriptions title="用户信息" layout="vertical" bordered column={4}>
          <Descriptions.Item label="账号">{user?.account}</Descriptions.Item>
          <Descriptions.Item label="姓名">{user?.name}</Descriptions.Item>
          <Descriptions.Item label="电话号码">
            {user?.phoneNumber}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {user?.createTime}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions
          title="推流信息"
          layout="vertical"
          bordered
          column={2}
          style={{ marginTop: 40 }}
        >
          <Descriptions.Item label="推流地址">
            {user && systemConfig
              ? `rtmp://${systemConfig.pushIp}:${systemConfig.pushPort}/stream`
              : '请联系管理员进行系统设置'}
          </Descriptions.Item>
          <Descriptions.Item label="推流密钥">
            {user?.streamKey}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions
          title="播放信息"
          layout="vertical"
          bordered
          column={2}
          style={{ marginTop: 40 }}
        >
          <Descriptions.Item label="播放地址1">
            {user && systemConfig
              ? `rtmp://${systemConfig.pushIp}:${systemConfig.pushPort}/live/${user.streamKey}`
              : '请联系管理员进行系统设置'}
          </Descriptions.Item>
          <Descriptions.Item label="播放地址2">
            {user && systemConfig
              ? `http://${systemConfig.pullIp}:${systemConfig.pullPort}/hls/${user.streamKey}.m3u8`
              : '请联系管理员进行系统设置'}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions
          title="我的直播"
          layout="vertical"
          bordered
          style={{ marginTop: 40 }}
        >
          <div>
            <Form
              name="live"
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
                    <Cascader options={mapChannelsToOptions(channels || [])} />
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
              dataSource={lives}
              columns={createColumns(live => deleteRequest.run(live.id))}
              pagination={false}
            />
          </div>
        </Descriptions>
      </div>
    </ContentWrapper>
  );
};

export default InfoPage;
