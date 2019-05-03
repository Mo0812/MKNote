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
    faSignOutAlt,
    faFileExport,
    faFileImport,
    faCodeBranch,
    faLock
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import "@/assets/scss/base.scss";
import "./registerServiceWorker";

Vue.use(BootstrapVue);

store.dispatch("initStore");

Vue.prototype.$moment = moment;

library.add(
    faPlus,
    faCode,
    faEye,
    faBookOpen,
    faTrash,
    faUserCircle,
    faCog,
    faIdBadge,
    faSignOutAlt,
    faFileExport,
    faFileImport,
    faCodeBranch,
    faLock
);
Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount("#app");
