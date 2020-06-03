import { history, Location, RequestConfig } from 'umi';

export const onRouteChange = ({ location }: { location: Location }) => {
  if (location.pathname.startsWith('/admin/')) {
    if (location.pathname !== '/admin/login') {
      if (!sessionStorage.getItem('ADMIN_LOGGED')) {
        history.replace('/admin/login');
      }
    } else {
      if (sessionStorage.getItem('ADMIN_LOGGED')) {
        history.replace('/admin/systemConfig');
      }
    }
  } else if (location.pathname.startsWith('/user/')) {
    if (location.pathname !== '/user/login') {
      if (!sessionStorage.getItem('USER_LOGGED')) {
        history.replace('/user/login');
      }
    } else {
      if (sessionStorage.getItem('USER_LOGGED')) {
        history.replace('/user/info');
      }
    }
  }
};

export const request: RequestConfig = {
    timeout: 5000,
    prefix: 'http://localhost:8080',
    errorConfig: {
      adaptor: (resData, ctx) => {
        return {
          success: !resData.err || !resData.status,
          errorMessage: resData.error,
        };
      },
    },
  }
;
