import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from "vuex-persist";

Vue.use(Vuex);

const state = {};
const defaultState = state;
const getters = {};
const mutations = {};
const actions = {};

const vuexPersist = new VuexPersist({
    key: "mk-notes",
    storage: localStorage
});

export default new Vuex.Store({
    state: state,
    getters: getters,
    mutations: mutations,
    actions: actions,
    plugins: [vuexPersist.plugin]
});
