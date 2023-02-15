import { defineConfig } from 'umi';

export default defineConfig({
  // "theme": {
  //   "primary-color": "#1DA57A",
  // },
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/test',
      component: '@/pages/test',
    },
    {
      path: 'cases/apiRelationCases',
      component: '@/pages/apiRelationCases',
    },
    {
      component: '@/limLayout',
      routes: [
        {
          name: '主页',
          path: '/home',
          icon: 'home',
          component: '@/pages/index',
        },
        {
          name: '项目管理',
          path: '/project',
          icon: 'project',
          component: '@/pages/project',
        },
        {
          name: '接口测试',
          path: '/apiCase',
          icon: 'case',
          component: '@/pages/apiCase',
        },
        // {
        //   path: '/apiData/data',
        //   component: '@/pages/apiData',
        // },
        // {
        //   path: '/apiData/apiOverview',
        //   component: '@/pages/projectOverview',
        // },

        {
          name: '系统设置',
          path: '/config',
          icon: 'config',
          routes: [
            {
              name: '用户管理',
              path: '/config/user',
              component: '@/pages/user',
            },
            {
              name: '环境管理',
              path: '/config/envir',
              component: '@/pages/envir',
            },
          ],
        },
      ],
    },
  ],
  fastRefresh: {},
  exportStatic: {}, //防止刷新页面出现404
  chainWebpack(conf) {
    // ....other config
    conf.module
      .rule('mjs$')
      .test(/\.mjs$/)
      .include.add(/node_modules/)
      .end()
      .type('javascript/auto');
  },
});
