import React, { useState } from 'react';
import { useRequest } from '@umijs/hooks';
import Api, { Live } from '@/api';
import Channels from './channels';
import { SelectParam } from 'antd/es/menu';
import Lives from '@/pages/show/lives';
import ContentWrapper from '@/components/content_wrapper';

const IndexPage = () => {
  const {
    data: systemConfig,
    error: systemConfigError,
    loading: systemConfigLoading,
  } = useRequest(Api.getSystemConfig);
  const { data: lives, error: livesError, loading: livesLoading } = useRequest(
    Api.getAvailableLives,
  );
  const {
    data: channels,
    error: channelsError,
    loading: channelsLoading,
  } = useRequest(Api.getAvailableChannels);
  const [filterLives, setFilterLives] = useState<Live[]>();

  const handleSelectSection = (param: SelectParam) => {
    if (param.key === 'ALL') {
      setFilterLives(lives ? [...lives] : []);
    } else {
      const sectionId = parseInt(param.key, 10);
      setFilterLives(lives?.filter(live => live.sectionId === sectionId));
    }
  };

  return (
    <ContentWrapper
      loading={systemConfigLoading || livesLoading || channelsLoading}
      error={systemConfigError || livesError || channelsError}
    >
      <div style={{ height: '100vh', overflow: 'hidden' }}>
        <Channels
          channels={channels || []}
          onSelectSection={handleSelectSection}
        />
        <div
          style={{
            padding: '20px',
            height: 'calc(100% - 80px)',
            overflow: 'auto',
          }}
        >
          <Lives
            systemConfig={systemConfig}
            lives={filterLives || lives || []}
          />
        </div>
      </div>
    </ContentWrapper>
  );
};

export default IndexPage;
