import React, { ReactNode } from 'react';
import Styles from './index.less';
import { Alert, Spin } from 'antd';

interface ContentWrapperProps {
  loading: boolean;
  error?: Error;
  children?: ReactNode;
}

const Loading = () => (
  <div className={Styles.root}>
    <div className={Styles.loading}>
      <Spin size="large" />
    </div>
  </div>
);

const Error = ({ error }: { error: Error }) => (
  <div className={Styles.error}>
    <Alert
      className={Styles.errorAlert}
      type="error"
      showIcon
      message="加载失败"
      description={error.message}
    />
  </div>
);

const ContentWrapper = ({ loading, error, children }: ContentWrapperProps) => {
  return (
    <div className={Styles.root}>
      {loading ? <Loading /> : error ? <Error error={error} /> : children}
    </div>
  );
};

export default ContentWrapper;
