import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Captions from "../views/Captions.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Captions",
    component: Captions
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
