import Vue from "vue";
import Router from "vue-router";

// 防止点击同一个路由时候报错
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/**
 * Note: 路由配置项
 *
 * hidden: true                   // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true               // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect           // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    noCache: true                // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'               // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false            // 如果设置为false，则不会在breadcrumb面包屑中显示
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  // tags-view刷新页面中间件
  {
    path: "/redirect",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/redirect/:path(.*)",
        component: resolve => require(["@/views/redirect"], resolve)
      }
    ]
  },

  // 登录
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true
  },

  // 错误页面
  {
    path: "/403",
    component: () => import("@/views/403"),
    hidden: true
  },

  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true
  },
  {
    path: "/500",
    component: () => import("@/views/500"),
    hidden: true
  },

  // 默认路由跳转到首页
  {
    path: "/",
    redirect: "/dashboard/index",
    component: Layout
  },

  // 首页
  {
    path: "/dashboard",
    name: "dashboard",
    component: Layout,
    redirect: "/dashboard/index",
    meta: {
      title: "首页",
      icon: "el-icon-s-home"
    },
    children: [
      {
        path: "index",
        name: "index",
        component: () => import("@/views/dashboard/index"),
        meta: { title: "首页", affix: true }
      }
    ]
  }

  // 404 page must be placed at the end !!!
  // 如果有权限菜单，需要写在权限路由加载后的最后面，不然刷新页面会404
  // { path: "*", redirect: "/404", hidden: true }
];

const createRouter = () =>
  new Router({
    mode: "history", // 使用history模式，需要设置base路径
    base: process.env.BASE_URL,
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
  // 防止退出后再登录，再次加载权限菜单会有重复的路由
  router.options.routes = constantRoutes;
}

export default router;
