import Vue from "vue";
import Router from "vue-router";
import store from "./store";
import Notes from "./views/Notes";
import LockScreen from "./views/LockScreen";

Vue.use(Router);

var routes = [
    {
        path: "/",
        name: "notes",
        component: Notes,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/about",
        name: "about",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import(/* webpackChunkName: "about" */ "./views/About.vue")
    },
    {
        path: "/settings",
        name: "settings",
        component: () => import("./views/Settings.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/profile",
        name: "profile",
        component: () => import("./views/Profile.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/lockscreen",
        name: "lockscreen",
        component: LockScreen
    }
];

var router = new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes: routes
});

router.beforeEach((to, from, next) => {
    if (
        to.matched.some(record => record.meta.requiresAuth) &&
        store.getters.getSecurity.secret === null
    ) {
        next("/lockscreen");
    } else {
        next();
    }
});

export default router;
