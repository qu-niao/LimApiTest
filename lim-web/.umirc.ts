import { defineConfig } from 'umi';

export default defineConfig({
  // "theme": {
  //   "primary-color": "#1DA57A",
  // },
  // history: { type: 'hash' },
  favicon: '/icon.ico',
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
      path: '/apiCaseFormPage',
      title: 'Lim-接口用例',
      component: '@/pages/apiCaseFormPage',
    },
    {
      path: '/apiReport',
      component: '@/pages/apiReport',
    },
    {
      component: '@/limLayout',
      routes: [
        {
          name: '主页',
          title: 'Lim-主页',
          path: '/home',
          icon: 'home',
          component: '@/pages/index',
        },
        {
          name: '项目管理',
          title: 'Lim-项目管理',
          path: '/project',
          icon: 'project',
          component: '@/pages/project',
        },
        {
          name: '接口测试',
          title: 'Lim-接口测试',
          path: '/apiCase',
          icon: 'case',
          component: '@/pages/apiCase',
        },
        {
          name: 'UI 测试',
          title: 'Lim-UI 测试',
          path: '/uiCase',
          icon: 'ui',
          component: '@/pages/uiCase',
        },
        {
          name: '系统设置',
          title: 'Lim-系统设置',
          path: '/config',
          icon: 'config',
          routes: [
            {
              name: '用户管理',
              title: 'Lim-用户管理',
              path: '/config/user',
              component: '@/pages/user',
            },
            {
              name: '环境管理',
              title: 'Lim-环境管理',
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
