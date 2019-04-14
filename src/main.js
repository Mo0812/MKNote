import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import i18n from "./i18n";

import BootstrapVue from "bootstrap-vue";
import moment from "moment";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
    faPlus,
    faCode,
    faEye,
    faBookOpen,
    faTrash,
    faUserCircle,
    faCog,
    faIdBadge,
    faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import "@/assets/scss/base.scss";

Vue.use(BootstrapVue);

const settings = store.getters.getSettings;
moment.locale(settings.lang);
Vue.prototype.moment = moment;

library.add(
    faPlus,
    faCode,
    faEye,
    faBookOpen,
    faTrash,
    faUserCircle,
    faCog,
    faIdBadge,
    faSignOutAlt
);
Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount("#app");
