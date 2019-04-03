import {
  IndexPage,
} from './routes/index.js';


/**
 * routerConfig的参数说明
 * @param path string 必须 路由
 * @param exact boolean 匹配规则
 * @param component object 必须 路由组件
 *
 * @param [title] string 该路由的title 默认为 XXXX项目
 * @param [backgroundColor] string 该路由的背景色， 默认为#fff
 * @param [needBackToLastView] boolean 是否记住该路由的滚动条位置  默认为 false
 * */
const routerConfig = [
  {
    path: '/',  // 设置路由
    exact: true, // 匹配规则
    component: IndexPage, // 路由组件
    title: '首页路由', // 设置路由标题
    backgroundColor: '#ffffff', // 该路由的背景色， 默认为#fff
    needBackToLastView: true, // 是否需要记住该路由下滚动条位置，默认false
  },
  {
    path: '/tabbar2/:id',  // 设置路由
    exact: true, // 匹配规则
    component: IndexPage, // 路由组件
    title: '路由二', // 设置路由标题
    backgroundColor: '#ffffff', // 该路由的背景色， 默认为#fff
    needBackToLastView: true, // 是否需要记住该路由下滚动条位置
  },
  {
    path: '/tabbar2',  // 设置路由
    exact: true, // 匹配规则
    component: IndexPage, // 路由组件
    title: '路由二', // 设置路由标题
    backgroundColor: '#ffffff', // 该路由的背景色， 默认为#fff
    needBackToLastView: true, // 是否需要记住该路由下滚动条位置
  },
  {
    path: '/tabbar3',  // 设置路由
    exact: true, // 匹配规则
    component: IndexPage, // 路由组件
    title: '路由三', // 设置路由标题
    backgroundColor: '#ffffff', // 该路由的背景色， 默认为#fff
    needBackToLastView: true, //
  },
];


export default routerConfig;