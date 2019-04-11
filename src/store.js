import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from "vuex-persist";
import shortid from "shortid";

import i18n from "./i18n";

Vue.use(Vuex);

const state = {
    noteIdOpen: "",
    notes: [],
    settings: {
        lang: process.env.VUE_APP_I18N_LOCALE,
        size: ""
    }
};
// const defaultState = state;
const getters = {
    getNoteIdOpen: state => state.noteIdOpen,
    getNoteOpen: state => {
        return state.notes.find(element => element.id === state.noteIdOpen);
    },
    getNotes: state => state.notes,
    getSettings: state => state.settings
};
const mutations = {
    NOTE_UPDATE: (state, payload) => {
        const notes = state.notes;
        var note = notes.find(element => element.id === payload.id);
        note.value = payload.value;
    },
    NOTE_OPEN: (state, payload) => {
        state.noteIdOpen = payload;
    },
    NOTE_ADD: (state, payload) => {
        var notes = state.notes;
        notes.push(payload);
    },
    NOTE_REMOVE: (state, payload) => {
        var notes = state.notes;
        notes = notes.filter(element => {
            return element.id !== payload;
        });
        state.notes = notes;
    },
    SETTINGS: (state, payload) => {
        state.settings = payload;
    }
};
const actions = {
    updateNote: (context, payload) => {
        context.commit("NOTE_UPDATE", payload);
    },
    openNote: (context, payload) => {
        context.commit("NOTE_OPEN", payload);
    },
    addNote: (context, payload) => {
        const newId = shortid.generate();
        const newNode = {
            id: newId,
            value: ""
        };
        context.commit("NOTE_ADD", newNode);
    },
    removeNote: (context, payload) => {
        context.commit("NOTE_REMOVE", payload);
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
