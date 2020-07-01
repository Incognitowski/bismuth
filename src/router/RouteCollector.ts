import { RouteConfig } from "vue-router";
import LoginRoute from "./Routes/LoginRoute";

export default class RouteCollector {
  static routes(): Array<RouteConfig> {
    return [LoginRoute.route()];
  }
}
