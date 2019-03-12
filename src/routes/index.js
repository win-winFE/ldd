import dynamic from 'dva/dynamic';


// 首页
export const IndexPage = dynamic({
  component: _ => import('./IndexPage'),
});

