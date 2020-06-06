import React from 'react';
import { BasicLayoutProps } from '@ant-design/pro-layout';
import Styles from './index.less';

const Header = ({ location, menuData }: BasicLayoutProps) => {
  const menu = menuData?.find(m => m.path === location?.pathname);
  return <div className={Styles.root}>{menu?.name}</div>;
};

export default Header;
export const headerRender = (props: BasicLayoutProps) => {
  return <Header {...props} />;
};
