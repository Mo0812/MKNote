import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from "vuex-persist";

import i18n from "./i18n";

Vue.use(Vuex);

const state = {
    note: {
        value: ""
    },
    settings: {
        lang: process.env.VUE_APP_I18N_LOCALE,
        size: ""
    }
};
// const defaultState = state;
const getters = {
    getNote: state => state.note,
    getSettings: state => state.settings
};
const mutations = {
    NOTE_VALUE: (state, payload) => {
        var note = state.note;
        note.value = payload.value;
    },
    SETTINGS: (state, payload) => {
        state.settings = payload;
    }
};
const actions = {
    note_value: (context, payload) => {
        context.commit("NOTE_VALUE", payload);
    },
    settings: (context, payload) => {
        i18n.locale = payload.lang;
        context.commit("SETTINGS", payload);
    }
};

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
