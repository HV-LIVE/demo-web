import React, { useState } from 'react';
import { Card, List, message } from 'antd';
import { Live, SystemConfig } from '@/api';
import ReactPlayer from 'react-player';

interface LivesProps {
  systemConfig?: SystemConfig;
  lives: Live[];
}

const Player = ({ url, onClose }: { url: string; onClose: () => void }) => {
  return (
    <div
      style={{
        position: 'fixed',
        margin: 'auto',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        background: '#0000007F',
      }}
      onClick={e => {
        if ((e.target as HTMLElement).nodeName === 'DIV') {
          onClose();
        }
      }}
    >
      <ReactPlayer
        style={{
          position: 'fixed',
          margin: 'auto',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }}
        url={url}
        playing
        controls
      />
    </div>
  );
};

const Lives = ({ systemConfig, lives }: LivesProps) => {
  const [playUrl, setPlayUrl] = useState<string>();

  return (
    <div>
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
              cover={
                <img
                  style={{ padding: '2px' }}
                  alt="cover"
                  src={require('@/images/cover.jpg')}
                />
              }
              onClick={() => {
                if (systemConfig) {
                  setPlayUrl(
                    `http://${systemConfig.pullIp}:${systemConfig.pullPort}/hls/${live.user.streamKey}.m3u8`,
                  );
                } else {
                  message.warn('请联系管理员进行系统设置');
                }
              }}
            >
              <Card.Meta
                title={live.title}
                description={`主播: ${live.user.name}`}
              />
            </Card>
          </List.Item>
        )}
      />
      {playUrl && (
        <Player url={playUrl} onClose={() => setPlayUrl(undefined)} />
      )}
    </div>
  );
};

export default Lives;
