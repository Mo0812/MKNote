import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from "vuex-persist";
import i18n from "@/i18n";
import Api from "@/api/Api";
import CryptoUtil from "@/utils/CryptoUtil";

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
    LOCK: (state, payload) => {
        const security = state.security;
        security.secret = null;
    }
};
const actions = {
    initStore: async (context, payload) => {
        console.log("init");
        try {
            const remote = await Api.getRemote();
            context.commit("REMOTE", remote);
            try {
                await Api.updateRemoteConnections(remote.enabled, remote.url);
            } catch (error) {
                console.log(error);
            }
        } catch (error) {
            console.log(error);
        }
        try {
            const settings = await Api.getSettings();
            context.commit("SETTINGS", settings);
        } catch (error) {
            console.log(error);
        }
    },
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
    settings: async (context, payload) => {
        await Api.setSettings(payload);
        context.commit("SETTINGS", payload);
    },
    remote: async (context, payload) => {
        await Api.updateRemoteConnections(payload.enabled, payload.url);
        context.commit("REMOTE", payload);
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
        await Api.updateSecret(payload.newSecret);
        context.commit("AUTHENTIFICATE", payload.newSecret);
        await Api.renewEncryption(payload.oldSecret);
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
            throw new Error("Need init");
        }
    },
    lock: (context, payload) => {
        context.commit("LOCK");
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
    actions: actions
    // plugins: [vuexPersist.plugin]
});
