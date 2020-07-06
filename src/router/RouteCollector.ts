import {RouteConfig} from "vue-router";
import LoginRoute from "./Routes/LoginRoute";
import RegisterRoute from "@/router/Routes/RegisterRoute";
import DashboardRoute from "@/router/Routes/DashboardRoute";

export default class RouteCollector {
    static routes(): Array<RouteConfig> {
        return [
            LoginRoute.route(),
            RegisterRoute.route(),
            DashboardRoute.route()
        ];
    }
}
