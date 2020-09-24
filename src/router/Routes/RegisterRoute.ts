import {RouteConfig} from "vue-router";

export default class RegisterRoute {
    static route(): RouteConfig {
        return {
            path: "/register",
            name: "Register",
            component: () =>
                import(/* webpackChunkName: "register" */ "@/views/authentication/Register.vue"),
        };
    }
}
