import React from 'react';
import { Button, Col, Form, Input, message, Row, Table } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useRequest } from '@umijs/hooks';
import Api, { Channel, Section } from '@/api';
import Sections from '@/pages/admin/channels/sections';
import ContentWrapper from '@/components/content_wrapper';
import Styles from './index.less';

const createColumns = (
  handleDelete: (channel: Channel) => void,
): ColumnType<Channel>[] => {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '频道名',
      dataIndex: 'name',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      render: (_, channel) => {
        return (
          <React.Fragment>
            <Button type="ghost" danger onClick={() => handleDelete(channel)}>
              删除
            </Button>
          </React.Fragment>
        );
      },
    },
  ];
};

const ChannelsPage = () => {
  const [form] = Form.useForm();
  const { data, error, loading, mutate } = useRequest(
    Api.getAllChannelsAndSections,
  );
  const createRequest = useRequest(Api.createChannel, {
    manual: true,
    onSuccess: res => {
      mutate(old => [...old, res]);
      form.resetFields();
      message.success('创建成功');
    },
  });
  const deleteRequest = useRequest(Api.deleteChannel, {
    manual: true,
    onSuccess: (res, [id]) => {
      mutate(old => old.filter(i => i.id !== id));
      message.success('删除成功');
    },
  });
  const handleCreateSection = (section: Section) => {
    mutate(old => {
      const channelIndex = old.findIndex(i => i.id === section.channelId);
      if (channelIndex !== -1) {
        const channel = { ...old[channelIndex] };
        channel.sections = channel.sections
          ? [...channel.sections, section]
          : [section];
        const res = [...old];
        res[channelIndex] = channel;
        return res;
      }
      return old;
    });
  };
  const handleDeleteSection = (channelId: number, sectionId: number) => {
    mutate(old => {
      const channelIndex = old.findIndex(i => i.id === channelId);
      if (channelIndex !== -1) {
        const channel = { ...old[channelIndex] };
        if (channel.sections) {
          channel.sections = channel.sections.filter(i => i.id !== sectionId);
        }
        const res = [...old];
        res[channelIndex] = channel;
        return res;
      }
      return old;
    });
  };

  return (
    <ContentWrapper loading={loading} error={error}>
      <div className={Styles.root}>
        <Form
          name="channel"
          onFinish={channel => createRequest.run(channel as Channel)}
          hideRequiredMark
          form={form}
        >
          <Row gutter={30} justify="center">
            <Col span={14} key="name">
              <Form.Item
                label="频道名"
                name="name"
                rules={[{ required: true, message: '请输入频道名' }]}
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
          columns={createColumns(channel => deleteRequest.run(channel.id))}
          pagination={false}
          expandable={{
            expandedRowRender: channel => (
              <Sections
                channelId={channel.id}
                sections={channel.sections}
                onCreate={handleCreateSection}
                onDelete={handleDeleteSection}
              />
            ),
          }}
        />
      </div>
    </ContentWrapper>
  );
};

export default ChannelsPage;
