import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from "vuex-persist";
import i18n from "@/i18n";
import Api from "@/api/Api";
import CryptoUtil from "@/utils/CryptoUtil";
import AuthentificationError from "@/error/AuthentificationError";

Vue.use(Vuex);

const state = {
    notes: [],
    settings: {
        lang: process.env.VUE_APP_I18N_LOCALE || "en",
        size: ""
    },
    security: {
        secret: null
    },
    remote: {
        enabled: false,
        url: null,
        liveSync: true
    }
};
// const defaultState = state;
const getters = {
    getNotes: state => state.notes,
    getSettings: state => state.settings,
    getSecurity: state => state.security,
    getRemote: state => state.remote
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
        i18n.locale = payload.lang;
        state.settings = payload;
    },
    REMOTE: (state, payload) => {
        state.remote = payload;
    },
    AUTHENTIFICATE: (state, payload) => {
        const security = state.security;
        security.secret = payload;
    },
    LOCK: state => {
        const security = state.security;
        security.secret = null;
    }
};
const actions = {
    initStore: async context => {
        console.log("init");
        try {
            const remote = await Api.getRemote();
            context.commit("REMOTE", remote);
            await Api.updateRemoteConnections(remote.enabled, remote.url);
        } catch (error) {
            console.log("no remote found");
        }

        try {
            const settings = await Api.getSettings();
            context.commit("SETTINGS", settings);
        } catch (error) {
            console.log("no settings found");
        }
    },
    initNotes: async context => {
        try {
            const docs = await Api.getNotes();
            context.commit("NOTE_INIT", docs);
        } catch (error) {
            throw error;
        }
    },
    updateNote: async (context, payload) => {
        try {
            await Api.updateNote(payload);
            context.commit("NOTE_UPDATE", payload);
        } catch (error) {
            throw error;
        }
    },
    addNote: async (context, payload) => {
        try {
            const newNode = await Api.addNote(payload);
            context.commit("NOTE_ADD", newNode);
        } catch (error) {
            throw error;
        }
    },
    removeNote: async (context, payload) => {
        try {
            await Api.removeNote(payload);
            context.commit("NOTE_REMOVE", payload);
        } catch (error) {
            throw error;
        }
    },
    settings: async (context, payload) => {
        try {
            await Api.setSettings(payload);
            context.commit("SETTINGS", payload);
        } catch (error) {
            throw error;
        }
    },
    remote: async (context, payload) => {
        try {
            await Api.updateRemoteConnections(payload.enabled, payload.url);
            context.commit("REMOTE", payload);
        } catch (error) {
            throw error;
        }
    },
    initAuthentification: async (context, payload) => {
        try {
            await Api.getSecret();
            return false;
        } catch {
            await Api.initSecret(payload);
            context.commit("AUTHENTIFICATE", payload);
            return true;
        }
    },
    renewAuthentification: async (context, payload) => {
        try {
            await Api.updateSecret(payload.newSecret);
            context.commit("AUTHENTIFICATE", payload.newSecret);
            await Api.renewEncryption(payload.oldSecret);
        } catch (error) {
            throw error;
        }
    },
    authentificate: async (context, payload) => {
        try {
            const secret = await Api.getSecret();
            if (secret.secret === CryptoUtil.hashString(payload)) {
                context.commit("AUTHENTIFICATE", payload);
                return true;
            } else {
                return false;
            }
        } catch {
            throw new AuthentificationError("Authentification data not found");
        }
    },
    lock: context => {
        context.commit("LOCK");
    }
};

const vuexPersist = new VuexPersist({
    key: "mk-note",
    storage: localStorage,
    reducer: state => ({ security: state.security })
});

export default new Vuex.Store({
    state: state,
    getters: getters,
    mutations: mutations,
    actions: actions,
    plugins: [vuexPersist.plugin]
});
