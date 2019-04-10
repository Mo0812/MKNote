import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from "vuex-persist";

Vue.use(Vuex);

const state = {
    note: {
        value: ""
    }
};
// const defaultState = state;
const getters = {
    getNote: state => state.note
};
const mutations = {
    NOTE_VALUE: (state, payload) => {
        var note = state.note;
        note.value = payload.value;
    }
};
const actions = {
    note_value: (context, payload) => {
        context.commit("NOTE_VALUE", payload);
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
