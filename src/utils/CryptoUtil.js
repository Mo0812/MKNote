import CryptoJS from "crypto-js";
import store from "@/store";

export default {
    encryptString(str) {
        return CryptoJS.AES.encrypt(str, this._getSecret()).toString();
    },
    decryptString(str) {
        const bytes = CryptoJS.AES.decrypt(str, this._getSecret());
        return bytes.toString(CryptoJS.enc.Utf8);
    },
    _getSecret() {
        const security = store.getters.getSecurity;
        return security.secret;
    }
};
