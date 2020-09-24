import {RouteConfig} from "vue-router";

export default class ApplicationRoute {
    static route(): RouteConfig {
        return {
            path: "/project/:projectId/application/:applicationId",
            name: "Application",
            component: () =>
                import(/* webpackChunkName: "application" */ "@/views/dashboard/ApplicationScreen.vue"),
        };
    }
}
