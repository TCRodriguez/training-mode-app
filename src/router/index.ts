import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/combo-viewer",
      name: "combo viewer",
      component: () => import("../views/SelectGameView.vue"),
    },
    {
      path: "/combo-viewer/:game/characters",
      name: "characters",
      component: () => import("../views/SelectCharacterView.vue")
    },
    {
      path: "/combo-viewer/:game/characters/:character",
      name: "combos",
      component: () => import("../views/CreateComboView.vue")
    }
  ],
});

export default router;
