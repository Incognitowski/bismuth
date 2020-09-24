import {RouteConfig} from "vue-router";

export default class ProjectsRoute {
    static route(): RouteConfig {
        return {
            path: "/dashboard/projects",
            name: "Projects",
            component: () =>
                import(/* webpackChunkName: "projects" */ "@/views/dashboard/Projects.vue"),
        };
    }
}
