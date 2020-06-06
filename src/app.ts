import { RequestConfig } from 'umi';
import Errors from './errors';
import { headerRender } from '@/components/header';

export const request: RequestConfig = {
  timeout: 5000,
  prefix: 'http://localhost:8080',
  errorConfig: {
    adaptor: (resData, ctx) => {
      return {
        success: !(ctx.res instanceof Response),
        errorMessage: Errors.getMessage(resData),
      };
    },
  },
};

export const layout = {
  headerRender,
  menuHeaderRender: false,
};
