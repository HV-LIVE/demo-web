import React from 'react';
import { Card, List } from 'antd';
import { Live } from '@/api';

interface LivesProps {
  lives: Live[],
}

const Lives = ({ lives }: LivesProps) => {
  return (
    <List
      grid={{
        gutter: 16,
        xs: 1,
        sm: 2,
        md: 2,
        lg: 2,
        xl: 3,
        xxl: 4,
      }}
      dataSource={lives}
      renderItem={live => (
        <List.Item key={live.id}>
          <Card
            hoverable
            style={{ height: '300px' }}
          >
            <Card.Meta title={live.title} description={live.user.name} />
          </Card>
        </List.Item>
      )}
    />
  );
};

export default Lives;
