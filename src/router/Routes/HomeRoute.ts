import { RouteConfig } from "vue-router";

export default class HomeRoute {
  static route(): RouteConfig {
    return {
      path: "/",
      name: "Home",
      component: () =>
        import(/* webpackChunkName: "about" */ "@/views/Home.vue"),
    };
  }
}
