import { RouteConfig } from "vue-router";

export default class AboutRoute {
  static route(): RouteConfig {
    return {
      path: "/about",
      name: "About",
      component: () =>
        import(/* webpackChunkName: "about" */ "@/views/About.vue"),
    };
  }
}
