import { RouteConfig } from "vue-router";
import LoginRoute from "./Routes/LoginRoute";
import RegisterRoute from "@/router/Routes/RegisterRoute";

export default class RouteCollector {
  static routes(): Array<RouteConfig> {
    return [
        LoginRoute.route(),
        RegisterRoute.route()
    ];
  }
}
