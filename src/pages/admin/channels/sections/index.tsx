import React from 'react';
import { Button, Col, Form, Input, message, Row, Table } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useRequest } from '@umijs/hooks';
import Api, { Section } from '@/api';
import Styles from './index.less';

const createColumns = (
  handleDelete: (channel: Section) => void,
): ColumnType<Section>[] => {
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
      render: (_, section) => {
        return (
          <React.Fragment>
            <Button type="ghost" danger onClick={() => handleDelete(section)}>
              删除
            </Button>
          </React.Fragment>
        );
      },
    },
  ];
};

interface SectionsProps {
  channelId: number;
  sections: Section[];
  onCreate: (section: Section) => void;
  onDelete: (channelId: number, sectionId: number) => void;
}

const Sections = ({
  channelId,
  sections,
  onCreate,
  onDelete,
}: SectionsProps) => {
  const [form] = Form.useForm();
  const createRequest = useRequest(Api.createSection, {
    manual: true,
    onSuccess: res => {
      onCreate(res);
      form.resetFields();
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
    <div className={Styles.root}>
      <Form
        name={`section_${channelId}`}
        onFinish={data => createRequest.run(data as Section)}
        initialValues={{ channelId }}
        hideRequiredMark
        form={form}
      >
        <Form.Item style={{ display: 'none' }} name="channelId">
          <Input type="hidden" />
        </Form.Item>
        <Row gutter={30} justify="center">
          <Col span={14} key="name">
            <Form.Item
              label="栏目名"
              name="name"
              rules={[{ required: true, message: '请输入栏目名' }]}
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
        dataSource={sections}
        columns={createColumns(channel => deleteRequest.run(channel.id))}
        pagination={false}
      />
    </div>
  );
};

export default Sections;
