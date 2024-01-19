import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import SelectGameViewVue from "../views/SelectGameView.vue";
import LoginView from "../views/LoginView.vue";
import DashboardViewVue from "../views/DashboardView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: "/",
    //   name: "home",
    //   component: SelectGameViewVue,
    // },
    // {
    //   path: "/",
    //   name: "home",
    //   component: () => import("../views/LoginView.vue"),
    // },
    {
      path: "/",
      name: "dashboard",
      component: () => import("../views/DashboardView.vue"),
    },
    // {
    //   path: "/about",
    //   name: "about",
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import("../views/AboutView.vue"),
    // },
    {
      path: "/select-character",
      name: "select character",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/games",
      name: "games",
      component: () => import("../views/SelectGameView.vue"),
    },
    {
      path: "/games/:game/characters",
      name: "characters",
      component: () => import("../views/SelectCharacterView.vue")
    },
    {
      path: "/games/:game/characters/:character",
      name: "character",
      component: () => import("../views/CharacterView.vue")
    },
    // {
    //   path: "/combo-viewer/:game/characters/:character",
    //   name: "combos",
    //   component: () => import("../views/CreateComboView.vue")
    // }
    {
      path: "/games/:game/create-combo",
      name: "combos",
      component: () => import("../views/CreateComboView.vue")
    }
  ],
});

router.beforeEach((to, from, next) => {
  // Check for `status` and `message` query parameters
  if (to.query.status && to.query.message) {
    // Handle the notification based on the status
    if (to.query.status === 'success') {
      // NotificationService.showSuccess(to.query.message);
      alert(to.query.message);
    } else if (to.query.status === 'failed') {
      // NotificationService.showError(to.query.message);
    }

    // Remove the query parameters and proceed to the route
    let newQuery = {...to.query};
    delete newQuery.status;
    delete newQuery.message;
    next({ path: to.path, query: newQuery });
  } else {
    next(); // Proceed as normal if no relevant query parameters
  }
});

export default router;
