import Vue from "vue";
import Router from "vue-router";
import Notes from "./views/Notes";

Vue.use(Router);

export default new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes: [
        {
            path: "/",
            name: "notes",
            component: Notes
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
            component: () => import("./views/Settings.vue")
        },
        {
            path: "/profile",
            name: "profile",
            component: () => import("./views/Profile.vue")
        }
    ]
});
