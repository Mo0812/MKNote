import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from "vuex-persist";
import shortid from "shortid";
import PouchDB from "pouchdb";

//import i18n from "./i18n";
shortid.characters(
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@"
);
const db = PouchDB("mknotes");

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
    getNoteView: state => state.noteView,
    getNotes: state => state.notes,
    getSettings: state => state.settings
};
const mutations = {
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
    updateNote: (context, payload) => {
        console.log(payload);
        db.get(payload._id)
            .then(doc => {
                doc.title = payload.title;
                doc.value = payload.value;
                return db.put(doc);
            })
            .then(response => {
                console.log(response);
                context.commit("NOTE_UPDATE", payload);
            })
            .catch(error => {
                console.log(error);
            });
    },
    addNote: (context, payload) => {
        const newId = shortid.generate();
        const newNode = {
            _id: newId,
            title: "",
            value: "",
            created: Date.now()
        };
        db.put(newNode)
            .then(response => {
                console.log(response);
                context.commit("NOTE_ADD", newNode);
            })
            .catch(error => {
                console.log(error);
            });
    },
    removeNote: (context, payload) => {
        db.get(payload)
            .then(doc => {
                return db.remove(doc);
            })
            .then(response => {
                console.log(response);
                context.commit("NOTE_REMOVE", payload);
            })
            .catch(error => {
                console.log(error);
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
