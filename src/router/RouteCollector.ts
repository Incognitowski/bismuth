import {RouteConfig} from "vue-router";
import LoginRoute from "./Routes/LoginRoute";
import RegisterRoute from "@/router/Routes/RegisterRoute";
import DashboardRoute from "@/router/Routes/DashboardRoute";
import ProjectsRoute from "@/router/Routes/ProjectsRoute";
import ProjectRoute from "@/router/Routes/ProjectRoute";
import ApplicationRoute from "@/router/Routes/ApplicationRoute";
import ObjectDictionaryPublicRoute from "@/router/Routes/ObjectDictionaryPublicRoute";

export default class RouteCollector {
    static routes(): Array<RouteConfig> {
        return [
            LoginRoute.route(),
            RegisterRoute.route(),
            DashboardRoute.route(),
            ProjectsRoute.route(),
            ProjectRoute.route(),
            ApplicationRoute.route(),
            ObjectDictionaryPublicRoute.route()
        ];
    }
}
