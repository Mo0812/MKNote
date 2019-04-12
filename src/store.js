import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from "vuex-persist";
import shortid from "shortid";

//import i18n from "./i18n";

Vue.use(Vuex);

const state = {
    noteView: {
        viewMode: "both",
        openId: null
    },
    notes: [],
    settings: {
        lang: process.env.VUE_APP_I18N_LOCALE || "en",
        size: ""
    }
};
// const defaultState = state;
const getters = {
    getNoteView: state => state.noteView,
    getNoteOpen: state => {
        return state.notes.find(
            element => element.id === state.noteView.openId
        );
    },
    getNotes: state => state.notes,
    getSettings: state => state.settings
};
const mutations = {
    NOTE_VIEW_MODE: (state, payload) => {
        var noteView = state.noteView;
        noteView.viewMode = payload;
    },
    NOTE_UPDATE: (state, payload) => {
        const notes = state.notes;
        var note = notes.find(element => element.id === payload.id);
        note.value = payload.value;
    },
    NOTE_OPEN: (state, payload) => {
        state.noteView.openId = payload;
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
    changeNoteView: (context, payload) => {
        context.commit("NOTE_VIEW_MODE", payload);
    },
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
