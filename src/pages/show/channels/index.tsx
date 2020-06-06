import React from 'react';
import { Menu } from 'antd';
import { AppstoreOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { SelectParam } from 'antd/es/menu';
import { Channel } from '@/api';

interface ChannelsProps {
  channels: Channel[];
  onSelectSection: (param: SelectParam) => void;
}

const Channels = ({ channels, onSelectSection }: ChannelsProps) => {
  return (
    <Menu
      mode="horizontal"
      theme="dark"
      style={{ height: '60px', lineHeight: '60px' }}
      defaultSelectedKeys={['ALL']}
      onSelect={onSelectSection}
    >
      <Menu.Item key="ALL" icon={<AppstoreOutlined />}>
        全部
      </Menu.Item>
      {channels.map(channel => (
        <Menu.SubMenu
          key={channel.id}
          title={channel.name}
          icon={<VideoCameraOutlined />}
        >
          {channel.sections.map(section => (
            <Menu.Item key={section.id}>{section.name}</Menu.Item>
          ))}
        </Menu.SubMenu>
      ))}
    </Menu>
  );
};

export default Channels;
