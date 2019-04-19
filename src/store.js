import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from "vuex-persist";
import Api from "@/api/Api";

Vue.use(Vuex);

const state = {
    notes: [],
    settings: {
        lang: process.env.VUE_APP_I18N_LOCALE || "en",
        size: ""
    }
};
// const defaultState = state;
const getters = {
    getNotes: state => state.notes,
    getSettings: state => state.settings
};
const mutations = {
    NOTE_INIT: (state, payload) => {
        state.notes = payload;
    },
    NOTE_UPDATE: (state, payload) => {
        const notes = state.notes;
        var note = notes.find(element => element._id === payload._id);
        note.title = payload.title;
        note.value = payload.value;
    },
    NOTE_ADD: (state, payload) => {
        var notes = state.notes;
        notes.push(payload);
    },
    NOTE_REMOVE: (state, payload) => {
        var notes = state.notes;
        notes = notes.filter(element => {
            return element._id !== payload;
        });
        state.notes = notes;
    },
    SETTINGS: (state, payload) => {
        state.settings = payload;
    }
};
const actions = {
    initNotes: (context, payload) => {
        Api.getNotes().then(docs => {
            context.commit("NOTE_INIT", docs);
        });
    },
    updateNote: (context, payload) => {
        Api.updateNote(payload).then(response => {
            context.commit("NOTE_UPDATE", payload);
        });
    },
    addNote: (context, payload) => {
        Api.addNote(payload).then(newNode => {
            context.commit("NOTE_ADD", newNode);
        });
    },
    removeNote: (context, payload) => {
        Api.removeNote(payload).then(response => {
            context.commit("NOTE_REMOVE", payload);
        });
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
