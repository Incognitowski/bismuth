import {RouteConfig} from "vue-router";

export default class ObjectDictionaryPublicRoute {
    static route(): RouteConfig {
        return {
            path: "/public/project/:projectId/application/:applicationId/dictionary/:objectDictionaryId",
            name: "ObjectDictionaryPublic",
            component: () =>
                import(/* webpackChunkName: "object-dictionary-public" */ "@/views/dashboard/ObjectDictionaryPublicScreen.vue"),
        };
    }
}
