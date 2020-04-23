import { RouteConfig } from "vue-router";
import AboutRoute from "./Routes/AboutRoute";
import HomeRoute from "./Routes/HomeRoute";

export default class RouteCollector {
  static routes(): Array<RouteConfig> {
    return [AboutRoute.route(), HomeRoute.route()];
  }
}
