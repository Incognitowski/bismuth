import { RouteConfig } from "vue-router";

export default class LoginRoute {
  static route(): RouteConfig {
    return {
      path: "/login",
      name: "Login",
      component: () =>
        import(/* webpackChunkName: "about" */ "@/views/authentication/Login.vue"),
    };
  }
}
