import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Captions from "../views/Captions.vue";
import Settings from "../views/Settings.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Captions",
    component: Captions
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
