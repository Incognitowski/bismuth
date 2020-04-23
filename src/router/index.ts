import Vue from "vue";
import VueRouter from "vue-router";
import RouteCollector from "./RouteCollector";

Vue.use(VueRouter);

const router = new VueRouter({
  routes: RouteCollector.routes(),
});

export default router;
