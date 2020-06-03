import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Col, Form, Input, message, Row, Table } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useRequest } from '@umijs/hooks';
import Api, { Channel, Section } from '@/api';
import Sections from '@/pages/admin/channels/sections';

function createColumns(handleDelete: (channel: Channel) => void): ColumnType<Channel> [] {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'NAME',
      dataIndex: 'name',
    },
    {
      title: 'CREATE_TIME',
      dataIndex: 'createTime',
    },
    {
      title: 'ACTIONS',
      render: (_, channel) => {
        return (
          <React.Fragment>
            <Button type="ghost" danger onClick={() => handleDelete(channel)}>删除</Button>
          </React.Fragment>
        );
      },
    },
  ];
}

const ChannelsPage = () => {
  const { data, error, loading, mutate } = useRequest(Api.getAllChannelsAndSections);
  const createRequest = useRequest(Api.createChannel, {
    manual: true,
    onSuccess: (res) => {
      mutate(old => [...old, res]);
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
        channel.sections = channel.sections ? [...channel.sections, section] : [section];
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
          onFinish={channel => createRequest.run(channel as Channel)}
        >
          <Row>
            <Col span={14} key="0">
              <Form.Item
                label="Channel Name"
                name="name"
                rules={[{ required: true, message: 'Please input your username!' }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={3} key="1">
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
    </PageHeaderWrapper>
  );
};

export default ChannelsPage;
