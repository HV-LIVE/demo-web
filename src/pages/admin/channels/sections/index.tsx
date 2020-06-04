import React from 'react';
import { Button, Col, Form, Input, message, Row, Table } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useRequest } from '@umijs/hooks';
import Api, { Section } from '@/api';

function createColumns(handleDelete: (channel: Section) => void): ColumnType<Section> [] {
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
      render: (_, section) => {
        return (
          <React.Fragment>
            <Button type="ghost" danger onClick={() => handleDelete(section)}>删除</Button>
          </React.Fragment>
        );
      },
    },
  ];
}

interface SectionsProps {
  channelId: number,
  sections: Section[],
  onCreate: (section: Section) => void,
  onDelete: (channelId: number, sectionId: number) => void,
}

const Sections = ({ channelId, sections, onCreate, onDelete }: SectionsProps) => {
  const createRequest = useRequest(Api.createSection, {
    manual: true,
    onSuccess: (res) => {
      onCreate(res);
      message.success('创建成功');
    },
  });
  const deleteRequest = useRequest(Api.deleteSection, {
    manual: true,
    onSuccess: (res, [id]) => {
      onDelete(channelId, id);
      message.success('删除成功');
    },
  });

  return (
    <div style={{ margin: '30px' }}>
      <Form
        name="basic"
        onFinish={data => createRequest.run(data as Section)}
        style={{ marginLeft: '30px' }}
        initialValues={{ channelId }}
      >
        <Form.Item
          style={{ display: 'none' }}
          name="channelId"
        >
          <Input type="hidden" />
        </Form.Item>
        <Row>
          <Col span={14} key="0">
            <Form.Item
              label="Section Name"
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
        dataSource={sections}
        columns={createColumns(channel => deleteRequest.run(channel.id))}
        pagination={false}
      />
    </div>
  );
};

export default Sections;
