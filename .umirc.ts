import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  antd: {},
  layout: {},
  routes: [
    {
      path: '/',
      component: '@/pages/show/index',
      layout: {
        hideMenu: true,
        hideNav: true,
      },
    },
    {
      path: '/admin',
      redirect: '/admin/systemConfig',
    },
    {
      path: '/admin/login',
      component: '@/pages/admin/login',
      layout: {
        hideMenu: true,
        hideNav: true,
      },
    },
    {
      path: '/admin/systemConfig',
      component: '@/pages/admin/system_config',
      icon: 'setting',
      menu: {
        name: 'System Config',
      },
    },
    {
      path: '/admin/users',
      component: '@/pages/admin/users',
      icon: 'team',
      menu: {
        name: 'Users',
      },
    },
    {
      path: '/admin/channels',
      component: '@/pages/admin/channels',
      icon: 'menu',
      menu: {
        name: 'Channels',
      },
    },
    {
      path: '/admin/lives',
      component: '@/pages/admin/lives',
      icon: 'videoCamera',
      menu: {
        name: 'Lives',
      },
    },
    {
      path: '/user',
      redirect: '/user/info',
    },
    {
      path: '/user/login',
      component: '@/pages/user/login',
      layout: {
        hideMenu: true,
        hideNav: true,
      },
    },
    {
      path: '/user/info',
      component: '@/pages/user/info',
      layout: {
        hideMenu: true,
        hideNav: true,
      },
    },
  ],
})
;
