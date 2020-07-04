import {RouteConfig} from "vue-router";

export default class RegisterRoute {
    static route(): RouteConfig {
        return {
            path: "/register",
            name: "Register",
            component: () =>
                import(/* webpackChunkName: "about" */ "@/views/authentication/Register.vue"),
        };
    }
}
