import {RouteConfig} from "vue-router";

export default class DashboardRoute {
    static route(): RouteConfig {
        return {
            path: "/dashboard",
            name: "Dashboard",
            component: () =>
                import(/* webpackChunkName: "dashboard" */ "@/views/dashboard/Dashboard.vue"),
        };
    }
}
