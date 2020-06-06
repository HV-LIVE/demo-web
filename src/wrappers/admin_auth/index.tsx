import React, { ReactNode } from 'react';
import { history } from 'umi';
import { useSessionStorageState } from '@umijs/hooks';

const AdminAuthWrapper = ({
  children,
  location,
}: {
  children?: ReactNode;
  location: Location;
}) => {
  const [logged] = useSessionStorageState('ADMIN_LOGGED');

  if (location.pathname !== '/admin/login') {
    if (!logged) {
      history.replace('/admin/login');
      return null;
    }
  } else {
    if (logged) {
      history.replace('/admin/systemConfig');
      return null;
    }
  }

  return children;
};

export default AdminAuthWrapper;
