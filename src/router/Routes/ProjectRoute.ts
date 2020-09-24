import {RouteConfig} from "vue-router";

export default class ProjectRoute {
    static route(): RouteConfig {
        return {
            path: "/project/:projectId",
            name: "Project",
            component: () =>
                import(/* webpackChunkName: "project" */ "@/views/dashboard/ProjectScreen.vue"),
        };
    }
}
