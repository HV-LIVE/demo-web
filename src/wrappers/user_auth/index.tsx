import React, { ReactNode } from 'react';
import { history } from 'umi';
import { useSessionStorageState } from '@umijs/hooks';

const UserAuthWrapper = ({
  children,
  location,
}: {
  children?: ReactNode;
  location: Location;
}) => {
  const [logged] = useSessionStorageState('USER_LOGGED');

  if (location.pathname !== '/user/login') {
    if (!logged) {
      history.replace('/user/login');
      return null;
    }
  } else {
    if (logged) {
      history.replace('/user/info');
      return null;
    }
  }

  return children;
};

export default UserAuthWrapper;
