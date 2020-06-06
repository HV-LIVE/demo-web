import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  antd: {},
  layout: {
    name: 'HV-LIVE',
  },
  locale: {
    antd: true,
  },
  define: {
    'process.env.API_URL': process.env.API_URL,
  },
  routes: [
    {
      path: '/admin',
      redirect: '/admin/systemConfig',
    },
    {
      path: '/admin/login',
      component: '@/pages/admin/login',
      wrappers: ['@/wrappers/admin_auth'],
      layout: {
        hideMenu: true,
        hideNav: true,
      },
    },
    {
      path: '/admin/systemConfig',
      component: '@/pages/admin/system_config',
      wrappers: ['@/wrappers/admin_auth'],
      name: '系统设置',
      icon: 'setting',
    },
    {
      path: '/admin/users',
      component: '@/pages/admin/users',
      wrappers: ['@/wrappers/admin_auth'],
      name: '用户管理',
      icon: 'team',
    },
    {
      path: '/admin/channels',
      component: '@/pages/admin/channels',
      wrappers: ['@/wrappers/admin_auth'],
      name: '频道管理',
      icon: 'menu',
    },
    {
      path: '/admin/lives',
      component: '@/pages/admin/lives',
      wrappers: ['@/wrappers/admin_auth'],
      name: '直播管理',
      icon: 'videoCamera',
    },
    {
      path: '/user',
      redirect: '/user/info',
    },
    {
      path: '/user/login',
      component: '@/pages/user/login',
      wrappers: ['@/wrappers/user_auth'],
      layout: {
        hideMenu: true,
        hideNav: true,
      },
    },
    {
      path: '/user/info',
      component: '@/pages/user/info',
      wrappers: ['@/wrappers/user_auth'],
      layout: {
        hideMenu: true,
        hideNav: true,
      },
    },
    {
      path: '/',
      component: '@/pages/show/index',
      layout: {
        hideMenu: true,
        hideNav: true,
      },
    },
    {
      redirect: '/',
      layout: {
        hideMenu: true,
        hideNav: true,
      },
    },
  ],
});
